import { useState, useRef, useCallback, useEffect } from 'react';
import { usePerson } from '../context/PersonContext';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  TrashIcon, 
  ClipboardIcon, 
  CheckIcon, 
  InboxIcon,
  UserPlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const PersonList = () => {
  const { people, deletePerson, isLoading } = usePerson();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Add event listener to handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDeleting && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleDeleteCancel();
      }
    };

    // Add event listener when modal is open
    if (isDeleting) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeleting]);

  // Add escape key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isDeleting && event.key === 'Escape') {
        handleDeleteCancel();
      }
    };

    if (isDeleting) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDeleting]);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPeople = people.filter((person) =>
    [person.firstName, person.lastName, person.email, person.phone, person.city, person.state]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = useCallback((id: string) => {
    setPersonToDelete(id);
    setIsDeleting(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (personToDelete) {
      try {
        await deletePerson(personToDelete);
      } catch (error) {
        console.error('Error deleting person:', error);
      } finally {
        // Ensure state is reset even if deletion fails
        handleDeleteCancel();
      }
    }
  }, [personToDelete, deletePerson]);

  const handleDeleteCancel = useCallback(() => {
    // Use a timeout to ensure smooth animation for modal closing
    document.body.classList.add('modal-closing');
    
    setTimeout(() => {
      setIsDeleting(false);
      setPersonToDelete(null);
      document.body.classList.remove('modal-closing');
    }, 50);
  }, []);

  const handleCopyClick = useCallback((text: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(fieldId);
        setTimeout(() => {
          setCopiedField(null);
        }, 3000);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }, []);

  // Column width styles
  const colWidths = {
    name: 'w-[20%]',
    email: 'w-[30%]',
    phone: 'w-[15%]',
    location: 'w-[25%]',
    actions: 'w-[10%]'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-4 border-t-violet-500 border-r-violet-300 border-b-violet-200 border-l-violet-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-12 animate-fade-in mt-8">Person Directory</h2>

        {/* Animated Search Bar - Only show when there are people in the list */}
        {people.length > 0 && (
          <div className="mb-10 flex justify-center">
            <div className="flex items-center bg-[#1f2937] border border-gray-700 rounded-full transition-all duration-300 overflow-hidden w-fit focus-within:ring-2 focus-within:ring-violet-500 hover:shadow-lg hover:shadow-violet-500/20">
              <button onClick={toggleSearch} className="p-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, email, or phone"
                className={`bg-transparent text-white placeholder-slate-400 outline-none transition-all duration-300 ease-in-out ${
                  isSearchOpen ? 'w-72 px-3 py-2 opacity-100' : 'w-0 px-0 py-0 opacity-0'
                }`}
              />
            </div>
          </div>
        )}

        {/* Empty State with Cactus - Show when no people in the list */}
        {people.length === 0 ? (
          <div className="overflow-hidden shadow-xl animate-fade-in">
            <div className="flex flex-col items-center justify-center py-20">
              <img 
                src="/cactus.png" 
                alt="Cactus" 
                className="w-64 h-64 opacity-90 mb-6"
              />
              <p className="text-2xl text-slate-300 text-center mb-8">It's dry out here… Add your first contact to bring life!</p>
              
              <Link to="/add" className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 transition-colors duration-300 rounded-full text-white font-medium shadow-lg hover:shadow-violet-600/50">
                <UserPlusIcon className="w-5 h-5" />
                <span>Add Your First Contact</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Table - Only show when there are people */
          <div className="overflow-x-auto animate-fade-in">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-xl ring-1 ring-gray-700 ring-opacity-5 rounded-lg">
                <table className="min-w-full table-fixed divide-y divide-slate-600 bg-[#1e293b]">
                  <thead className="bg-[#334155] min-w-full">
                    <tr>
                      <th className={`px-6 py-4 text-center text-xl font-medium text-white tracking-wide ${colWidths.name}`}>
                        <div className="flex items-center justify-center gap-2">
                          <UserIcon className="w-5 h-5" />
                          <span>Name</span>
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-center text-xl font-medium text-white tracking-wide ${colWidths.email}`}>
                        <div className="flex items-center justify-center gap-2">
                          <EnvelopeIcon className="w-5 h-5" />
                          <span>Email</span>
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-center text-xl font-medium text-white tracking-wide ${colWidths.phone}`}>
                        <div className="flex items-center justify-center gap-2">
                          <PhoneIcon className="w-5 h-5" />
                          <span>Phone</span>
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-center text-xl font-medium text-white tracking-wide ${colWidths.location}`}>
                        <div className="flex items-center justify-center gap-2">
                          <MapPinIcon className="w-5 h-5" />
                          <span>Location</span>
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-center text-xl font-medium text-white tracking-wide ${colWidths.actions}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600">
                    {filteredPeople.length === 0 ? (
                      <tr className={`bg-zinc-900 transition duration-200 cursor-pointer`}>
                        <td colSpan={5} className="px-6 py-4 text-sm text-center text-white font-medium">
                          <div className="flex flex-col items-center gap-4">
                            <InboxIcon className="w-16 h-16 text-slate-400" />
                            <p className="text-lg">No people match your search</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPeople.map((person, index) => (
                        <tr 
                          key={person.id} 
                          className={`${index % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-900'} hover:bg-[#2d3748] transition duration-200 cursor-pointer`}
                        >
                          <td className={`px-6 py-4 text-sm text-center text-white font-medium break-words ${colWidths.name}`}>
                            {person.firstName} {person.lastName}
                          </td>
                          <td className={`px-6 py-4 text-sm text-slate-300 break-words ${colWidths.email}`}>
                            <div className="flex items-center justify-between group">
                              <span 
                                onClick={() => handleCopyClick(person.email, `email-${person.id}`)}
                                className="truncate group-hover:font-bold transition-all duration-200 cursor-pointer hover:text-white"
                                title="Click to copy email"
                              >
                                {person.email}
                              </span>
                              <button 
                                onClick={() => handleCopyClick(person.email, `email-${person.id}`)}
                                className="text-gray-400 hover:text-gray-300 transition duration-200 flex-shrink-0 ml-2"
                                title="Copy email"
                              >
                                {copiedField === `email-${person.id}` ? (
                                  <CheckIcon className="w-4 h-4 text-green-500" />
                                ) : (
                                  <ClipboardIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-sm text-slate-300 break-words ${colWidths.phone}`}>
                            <div className="flex items-center justify-between group">
                              <span 
                                onClick={() => handleCopyClick(person.phone, `phone-${person.id}`)}
                                className="group-hover:font-bold transition-all duration-200 cursor-pointer hover:text-white"
                                title="Click to copy phone number"
                              >
                                {person.phone}
                              </span>
                              <button 
                                onClick={() => handleCopyClick(person.phone, `phone-${person.id}`)}
                                className="text-gray-400 hover:text-gray-300 transition duration-200 flex-shrink-0 ml-2"
                                title="Copy phone"
                              >
                                {copiedField === `phone-${person.id}` ? (
                                  <CheckIcon className="w-4 h-4 text-green-500" />
                                ) : (
                                  <ClipboardIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-sm text-center text-slate-300 break-words ${colWidths.location}`}>
                            {person.city}, {person.state}
                          </td>
                          <td className={`px-6 py-4 text-sm text-center ${colWidths.actions}`}>
                            <button
                              onClick={() => handleDeleteClick(person.id)}
                              className="text-red-400 hover:text-red-300 font-semibold transition duration-200 flex items-center justify-center gap-1"
                            >
                              Delete <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleting && personToDelete && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          >
            <div 
              ref={modalRef}
              className="bg-[#1f1f1f] p-8 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md text-center animate-fade-in"
            >
              <div className="flex justify-center mb-4">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this person? This action cannot be undone.</p>

              <div className="flex flex-row justify-center gap-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-8 py-4 bg-black text-white rounded-lg text-center w-full sm:w-auto font-medium hover:border hover:border-violet-500 hover:shadow-violet-500/30 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-8 py-4 bg-red-600 text-white rounded-lg transition-all duration-300 text-center w-full sm:w-auto font-medium hover:bg-red-700 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonList;
