import { createContext, useContext, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { Person, FormData } from '../types';

// Storage key as a constant for consistency
const STORAGE_KEY = 'people';

// Query keys as constants for consistency across the application
const QUERY_KEYS = {
  people: ['people'],
} as const;

interface PersonContextType {
  people: Person[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  addPerson: (data: FormData) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
}

// Create a more strongly typed context with default values
const PersonContext = createContext<PersonContextType>({
  people: [],
  isLoading: false,
  isError: false,
  error: null,
  addPerson: async () => {},
  deletePerson: async () => {},
});

// Helper function to safely parse JSON from localStorage
const getSavedPeople = (): Person[] => {
  try {
    const storedPeople = localStorage.getItem(STORAGE_KEY);
    return storedPeople ? JSON.parse(storedPeople) : [];
  } catch (error) {
    console.error('Error loading people from localStorage:', error);
    return [];
  }
};

// Helper function to safely save JSON to localStorage
const savePeople = (people: Person[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch (error) {
    console.error('Error saving people to localStorage:', error);
  }
};

export function PersonProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Query to fetch people data
  const { 
    data: people = [], 
    isLoading,
    isError,
    error
  } = useQuery<Person[], Error>({
    queryKey: QUERY_KEYS.people,
    queryFn: getSavedPeople,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation to add a person
  const addPersonMutation = useMutation<Person[], Error, Person>({
    mutationFn: async (newPerson) => {
      const updatedPeople = [...people, newPerson];
      savePeople(updatedPeople);
      return updatedPeople;
    },
    onSuccess: (updatedPeople) => {
      queryClient.setQueryData(QUERY_KEYS.people, updatedPeople);
    },
    onError: (error) => {
      console.error('Error adding person:', error);
    }
  });

  // Mutation to delete a person
  const deletePersonMutation = useMutation<Person[], Error, string>({
    mutationFn: async (id) => {
      const updatedPeople = people.filter((person) => person.id !== id);
      savePeople(updatedPeople);
      return updatedPeople;
    },
    onSuccess: (updatedPeople) => {
      queryClient.setQueryData(QUERY_KEYS.people, updatedPeople);
    },
    onError: (error) => {
      console.error('Error deleting person:', error);
    }
  });

  // Memoized add person function
  const addPerson = useCallback(async (data: FormData) => {
    const newPerson: Person = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      ...data,
    };
    await addPersonMutation.mutateAsync(newPerson);
  }, [addPersonMutation]);

  // Memoized delete person function
  const deletePerson = useCallback(async (id: string) => {
    await deletePersonMutation.mutateAsync(id);
  }, [deletePersonMutation]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    people,
    isLoading,
    isError,
    error,
    addPerson,
    deletePerson,
  }), [people, isLoading, isError, error, addPerson, deletePerson]);

  return (
    <PersonContext.Provider value={contextValue}>
      {children}
    </PersonContext.Provider>
  );
}

// Custom hook with better error messaging and type safety
export function usePerson(): PersonContextType {
  const context = useContext(PersonContext);
  return context;
} 