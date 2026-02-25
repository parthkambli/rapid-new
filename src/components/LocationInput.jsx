// import React, { useState, useEffect, useCallback } from 'react';
// import apiClient, { apiEndpoints } from '../services/apiClient';

// // Location Input Component with Search and Create functionality
// const LocationInput = ({
//   label,
//   value,
//   onChange,
//   type,
//   placeholder = "Select or type...",
//   required = false,
//   className = "",
//   disabled = false
// }) => {
//   const [options, setOptions] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [filteredOptions, setFilteredOptions] = useState([]);

//   // Fetch locations by type
//   const fetchLocations = useCallback(async () => {
//     if (!type) return;

//     setIsLoading(true);
//     try {
//       const response = await apiClient.get(apiEndpoints.locations.getByType(type));
//       if (response.data.success) {
//         setOptions(response.data.data);
//       }
//     } catch (error) {
//       console.error(`Error fetching ${type} locations:`, error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [type]);

//   // Load locations when component mounts or type changes
//   useEffect(() => {
//     fetchLocations();
//   }, [fetchLocations]);

//   // Initialize input value from prop
//   useEffect(() => {
//     setInputValue(value || '');
//   }, [value]);

//   // Filter options based on input
//   useEffect(() => {
//     if (!inputValue) {
//       setFilteredOptions(options);
//     } else {
//       const filtered = options.filter(option =>
//         option.name.toLowerCase().includes(inputValue.toLowerCase())
//       );

//       // If input doesn't match any existing option, add it as a create option
//       const exists = options.some(option =>
//         option.name.toLowerCase() === inputValue.toLowerCase()
//       );

//       if (!exists && inputValue.trim()) {
//         filtered.unshift({
//           id: 'create-new',
//           name: inputValue,
//           isCreateOption: true
//         });
//       }

//       setFilteredOptions(filtered);
//     }
//   }, [inputValue, options]);

//   // Handle selection
//   const handleSelect = (option) => {
//     let selectedValue = option.name;

//     // Convert to uppercase for consistency (as per existing system)
//     selectedValue = selectedValue.toUpperCase();

//     if (option.isCreateOption) {
//       // Create new location
//       createLocation(selectedValue);
//     } else {
//       onChange(selectedValue);
//     }
//     setInputValue(selectedValue);
//     setIsOpen(false);
//   };

//   // Create new location
//   const createLocation = async (name) => {
//     try {
//       const response = await apiClient.post(apiEndpoints.locations.create, {
//         type,
//         name
//       });
//       if (response.data.success) {
//         onChange(name);
//         // Refresh the options to include the newly created location
//         fetchLocations();
//       }
//     } catch (error) {
//       console.error('Error creating location:', error);
//       // If creation fails, still use the typed value
//       onChange(name);
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputValue(value);
//     // Update parent when user is typing
//     onChange(value.toUpperCase());
//     setIsOpen(true);
//   };

//   // Handle blur to close dropdown after a delay
//   const handleInputBlur = () => {
//     setTimeout(() => setIsOpen(false), 150);
//   };

//   // Handle focus to open dropdown
//   const handleInputFocus = () => {
//     setIsOpen(true);
//   };

//   return (
//     <div className={`relative ${className}`}>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>

//       <div className="relative">
//         <input
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onFocus={handleInputFocus}
//           onBlur={handleInputBlur}
//           placeholder={placeholder}
//           disabled={disabled || isLoading}
//           className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
//             ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
//             ${isLoading ? 'opacity-75' : ''}`}
//         />

//         {isLoading && (
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//             <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         )}
//       </div>

//       {isOpen && filteredOptions.length > 0 && (
//         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//           {filteredOptions.map((option) => (
//             <div
//               key={option.id}
//               onClick={() => handleSelect(option)}
//               className={`px-3 py-2 cursor-pointer hover:bg-blue-50 transition
//                 ${option.isCreateOption ? 'text-green-600 font-medium' : 'text-gray-700'}`}
//             >
//               {option.isCreateOption ? (
//                 <span>+ Create "{option.name}"</span>
//               ) : (
//                 <span>{option.name}</span>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocationInput;







import React, { useState, useEffect, useCallback, useRef } from 'react';
import apiClient, { apiEndpoints } from '../services/apiClient';
import { toast } from 'react-toastify'; // अगर use कर रहे हो

const LocationInput = ({
  label,
  value = '',
  onChange,
  type,
  placeholder = "Type or select...",
  required = false,
  className = "",
  disabled = false
}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  // Fetch all locations of this type
  const fetchLocations = useCallback(async () => {
    if (!type) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.locations.getByType(type));
      if (response.data.success) {
        setOptions(response.data.data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type} locations:`, error);
      toast?.error(`Failed to load ${type}s`);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Sync input value with prop (external changes)
  useEffect(() => {
    setInputValue(value?.toUpperCase() || '');
  }, [value]);

  // Filter options + add "Create new" if needed
  useEffect(() => {
    let filtered = options;

    if (inputValue.trim()) {
      filtered = options.filter(option =>
        option.name.toLowerCase().includes(inputValue.toLowerCase().trim())
      );
    }

    // Check if exact match exists
    const exactMatch = options.find(
      opt => opt.name.toLowerCase() === inputValue.toLowerCase().trim()
    );

    // Add "Create new" option if no exact match and input is not empty
    if (!exactMatch && inputValue.trim()) {
      filtered = [
        {
          _id: 'create-new',
          name: inputValue.trim(),
          isCreateOption: true
        },
        ...filtered
      ];
    }

    setFilteredOptions(filtered);
  }, [inputValue, options]);

  // Create new location
  const createLocation = async (name) => {
    if (!name.trim()) return;

    try {
      const response = await apiClient.post(apiEndpoints.locations.create, {
        type,
        name: name.trim()
      });

      if (response.data.success) {
        const newLocation = response.data.data;
        // Update options with new location
        setOptions(prev => [...prev, newLocation]);
        // Set final value
        onChange(newLocation.name); // uppercase already from backend
        toast?.success(`${type} "${newLocation.name}" created!`);
      }
    } catch (error) {
      console.error('Error creating location:', error);
      if (error.response?.data?.message?.includes('duplicate')) {
        toast?.info(`${type} "${name}" already exists.`);
        onChange(name.toUpperCase());
      } else {
        toast?.error('Failed to create location');
        // Still allow typed value even if API fails
        onChange(name.toUpperCase());
      }
    }
  };

  const handleSelect = (option) => {
    if (option.isCreateOption) {
      createLocation(option.name);
    } else {
      onChange(option.name); // already uppercase
    }
    setInputValue(option.name);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    // Optional: only send to parent on select or blur, not on every keystroke
    // Remove onChange here if causing issues
  };

  // On blur: if typed value doesn't match any, create it
  const handleBlur = () => {
    setTimeout(() => {
      const trimmed = inputValue.trim();
      if (trimmed) {
        const exists = options.some(
          opt => opt.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (!exists) {
          createLocation(trimmed);
        } else {
          // Just ensure uppercase
          const matched = options.find(
            opt => opt.name.toLowerCase() === trimmed.toLowerCase()
          );
          onChange(matched.name);
          setInputValue(matched.name);
        }
      }
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3] outline-none uppercase text-sm
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${isLoading ? 'opacity-75' : ''}`}
      />

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option._id || option.name} // safe key
              onMouseDown={(e) => e.preventDefault()} // prevent blur before click
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer transition
                ${option.isCreateOption 
                  ? 'bg-green-50 text-green-700 font-medium border-t border-green-200' 
                  : 'hover:bg-[#15BBB3] hover:text-white text-gray-800'}`}
            >
              {option.isCreateOption ? (
                <>+ Create new: "{option.name}"</>
              ) : (
                <>{option.name}</>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
};

export default LocationInput;