// import React, { useState, useEffect, useRef } from "react";
// import ReactDOM from "react-dom";

// const Table = ({ data, actions = [], extraColumns = [] }) => {
//   const [isOpen, setIsOpen] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const menuRef = useRef(null);
//   const buttonRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   const formatHeader = (header) => {
//     return String(header)
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase());
//   };

//   const handleActionClick = (e, action, row, index) => {
//     e.preventDefault();
//     if (action.onClick) {
//       action.onClick(row, index);
//     }
//     setIsOpen(null);
//   };

//   const toggleMenu = (index, e) => {
//     if (isOpen === index) {
//       setIsOpen(null);
//     } else {
//       const button = e.currentTarget;
//       if (button) {
//         const rect = button.getBoundingClientRect();
//         const dropdownWidth = 192;
//         const offsetY = 8;
//         const offsetX = 10;
//         let leftPosition = rect.left + window.scrollX + offsetX;

//         if (leftPosition + dropdownWidth > window.innerWidth) {
//           leftPosition = rect.right + window.scrollX - dropdownWidth;
//         }

//         setDropdownPosition({
//           top: rect.bottom + window.scrollY + offsetY,
//           left: leftPosition,
//         });
//       }
//       setIsOpen(index);
//     }
//   };

//   const handleClickOutside = (e) => {
//     if (
//       isOpen !== null &&
//       menuRef.current &&
//       !menuRef.current.contains(e.target) &&
//       e.target !== buttonRef.current
//     ) {
//       setIsOpen(null);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   if (!data || data.length === 0) {
//     return <p className="text-gray-500">No data available</p>;
//   }

//   // Exclude 'followUps' and '_id' from baseHeaders to prevent direct rendering
//   // '_id' is excluded because we use 'id' field instead for display
//   const baseHeaders = data[0]
//     ? Object.keys(data[0]).filter((key) => key !== "followUps" && key !== "_id")
//     : [];
//   const allHeaders = [...baseHeaders, ...extraColumns.map((col) => col.header)].filter(
//     (item, index, self) => index === self.indexOf(item)
//   );

//   const renderDropdown = (row, index) => {
//     if (isOpen === index && actions.some((action) => action.useDropdown)) {
//       return ReactDOM.createPortal(
//         <div
//           ref={menuRef}
//           className="absolute w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//           style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
//         >
//           {actions
//             .filter((action) => action.useDropdown)
//             .map((action, aIndex) => (
//               <button
//                 key={aIndex}
//                 onClick={(e) => handleActionClick(e, action, row, index)}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 {action.label}
//               </button>
//             ))}
//         </div>,
//         document.body
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="w-full bg-white relative">
//       {isMobile ? (
//         <div className="md:hidden space-y-4">
//           {data.map((row, index) => (
//             <div key={index} className="border border-[#898787] rounded-md p-4 bg-[#F1F6F6] shadow-sm">
//               <div className="space-y-3">
//                 {allHeaders.map((key, i) => (
//                   <div key={i} className="flex justify-between items-start border-b border-[#898787] pb-2">
//                     <span className="text-sm font-semibold text-[#1B504E] flex-shrink-0 w-1/3">
//                       {formatHeader(key)}:
//                     </span>
//                     <span className="text-sm text-gray-800 text-right flex-1">
//                       {extraColumns.find((col) => col.header === key)
//                         ? extraColumns.find((col) => col.header === key).render(row, index)
//                         : row[key]}
//                     </span>
//                   </div>
//                 ))}
//                 {actions.length > 0 && (
//                   <div className="flex justify-end pt-3">
//                     <div className="relative">
//                       {actions.some((action) => action.useDropdown) ? (
//                         <>
//                           <button
//                             onClick={(e) => toggleMenu(index, e)}
//                             className="text-gray-600 hover:text-gray-900 focus:outline-none text-lg font-bold"
//                           >
//                             ⋮
//                           </button>
//                           {renderDropdown(row, index)}
//                         </>
//                       ) : (
//                         <div className="flex space-x-2">
//                           {actions
//                             .filter((action) => action.showAsIcon)
//                             .map((action, aIndex) => (
//                               <button
//                                 key={aIndex}
//                                 onClick={(e) => handleActionClick(e, action, row, index)}
//                                 className="text-gray-600 hover:text-gray-900"
//                                 title={action.label}
//                               >
//                                 {action.icon}
//                               </button>
//                             ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="w-full overflow-x-auto">
//           <table className="min-w-full border-collapse bg-[#F1F6F6] rounded-md">
//             <thead>
//               <tr className="border-b border-[#898787] rounded-md">
//                 {allHeaders.map((header, i) => (
//                   <th
//                     key={i}
//                     className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap"
//                   >
//                     {formatHeader(header)}
//                   </th>
//                 ))}
//                 {actions.length > 0 && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
//                     Actions
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, index) => (
//                 <tr key={index} className="border-b border-[#898787] hover:bg-[#e6eded]">
//                   {allHeaders.map((key, i) => (
//                     <td key={i} className="px-6 py-2 text-sm text-[#000000] whitespace-nowrap">
//                       {extraColumns.find((col) => col.header === key)
//                         ? extraColumns.find((col) => col.header === key).render(row, index)
//                         : row[key]}
//                     </td>
//                   ))}
//                   {actions.length > 0 && (
//                     <td className="px-6 py-2 text-sm whitespace-nowrap">
//                       <div className="relative flex space-x-2">
//                         {actions
//                           .filter((action) => action.showAsIcon)
//                           .map((action, aIndex) => (
//                             <button
//                               key={aIndex}
//                               onClick={(e) => handleActionClick(e, action, row, index)}
//                               className="text-gray-600 hover:text-gray-900"
//                               title={action.label}
//                             >
//                               {action.icon}
//                             </button>
//                           ))}
//                         {actions.some((action) => action.useDropdown) && (
//                           <>
//                             <button
//                               onClick={(e) => toggleMenu(index, e)}
//                               className="text-gray-600 hover:text-gray-900 focus:outline-none text-lg font-bold"
//                             >
//                               ⋮
//                             </button>
//                             {renderDropdown(row, index)}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Table;














// // src/components/mainComponents/Table.jsx
// import React, { useState, useEffect, useRef } from "react";
// import ReactDOM from "react-dom";

// const Table = ({ 
//   data, 
//   actions = [], 
//   extraColumns = [], 
//   pagination = false,        // ← New prop
//   defaultPageSize = 10       // ← New prop (optional)
// }) => {
//   const [isOpen, setIsOpen] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const menuRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(defaultPageSize);

//   const formatHeader = (header) => {
//     return String(header)
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase());
//   };

//   const handleActionClick = (e, action, row, index) => {
//     e.preventDefault();
//     if (action.onClick) action.onClick(row, index);
//     setIsOpen(null);
//   };

//   const toggleMenu = (index, e) => {
//     if (isOpen === index) {
//       setIsOpen(null);
//     } else {
//       const button = e.currentTarget;
//       const rect = button.getBoundingClientRect();
//       const dropdownWidth = 192;
//       let leftPosition = rect.left + window.scrollX + 10;

//       if (leftPosition + dropdownWidth > window.innerWidth) {
//         leftPosition = rect.right + window.scrollX - dropdownWidth;
//       }

//       setDropdownPosition({
//         top: rect.bottom + window.scrollY + 8,
//         left: leftPosition,
//       });
//       setIsOpen(index);
//     }
//   };

//   const handleClickOutside = (e) => {
//     if (isOpen !== null && menuRef.current && !menuRef.current.contains(e.target)) {
//       setIsOpen(null);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   // Reset page when data or pageSize changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [data, pageSize]);

//   // =============== PAGINATION LOGIC ===============
//   const totalItems = data?.length || 0;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = Math.min(startIndex + pageSize, totalItems);
//   const currentData = pagination ? data.slice(startIndex, endIndex) : data;

//   const generatePageNumbers = () => {
//     const pages = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else if (currentPage <= 4) {
//       pages.push(1, 2, 3, 4, 5);
//       pages.push("...");
//       pages.push(totalPages);
//     } else if (currentPage >= totalPages - 3) {
//       pages.push(1);
//       pages.push("...");
//       for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       pages.push("...");
//       pages.push(currentPage - 1);
//       pages.push(currentPage);
//       pages.push(currentPage + 1);
//       pages.push("...");
//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   const pageNumbers = generatePageNumbers();

//   // =============== RENDER HELPERS ===============
//   if (!data || data.length === 0) {
//     return <p className="text-gray-500 text-center py-8">No data available</p>;
//   }

//   const baseHeaders = data[0]
//     ? Object.keys(data[0]).filter((key) => key !== "followUps" && key !== "_id")
//     : [];

//   const allHeaders = [...baseHeaders, ...extraColumns.map((col) => col.header)]
//     .filter((item, index, self) => index === self.indexOf(item));

//   const renderDropdown = (row, index) => {
//     if (isOpen === index && actions.some(a => a.useDropdown)) {
//       return ReactDOM.createPortal(
//         <div
//           ref={menuRef}
//           className="absolute w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//           style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
//         >
//           {actions
//             .filter(a => a.useDropdown)
//             .map((action, i) => (
//               <button
//                 key={i}
//                 onClick={(e) => handleActionClick(e, action, row, index)}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 {action.label}
//               </button>
//             ))}
//         </div>,
//         document.body
//       );
//     }
//     return null;
//   };

//   const renderCell = (row, key, index) => {
//     const extraCol = extraColumns.find(col => col.header === key);
//     return extraCol ? extraCol.render(row, index) : row[key] ?? "-";
//   };

//   // =============== PAGINATION COMPONENT ===============
//   const PaginationControls = () => {
//     if (!pagination) return null;

//     return (
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
//         {/* Showing info */}
//         <div className="text-sm font-medium text-gray-700">
//           Showing <span className="text-[#398C89] font-bold">{startIndex + 1}</span> to{" "}
//           <span className="text-[#398C89] font-bold">{endIndex}</span> of{" "}
//           <span className="text-[#398C89] font-bold">{totalItems}</span> entries
//         </div>

//         <div className="flex items-center gap-6">
//           {/* Page Size */}
//           <div className="flex items-center gap-3">
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] outline-none"
//             >
//               {[5, 10, 25, 50, 100].map(size => (
//                 <option key={size} value={size}>{size}</option>
//               ))}
//             </select>
//             <span className="text-sm text-gray-600">per page</span>
//           </div>

//           {/* Page Numbers */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-100 transition"
//             >
//               Previous
//             </button>

//             {pageNumbers.map((page, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => typeof page === "number" && setCurrentPage(page)}
//                 disabled={page === "..."}
//                 className={`w-11 h-11 text-sm font-semibold rounded-lg border transition ${
//                   page === currentPage
//                     ? "bg-[#398C89] text-white border-[#398C89] shadow-md"
//                     : page === "..."
//                     ? "text-gray-500 cursor-default border-transparent"
//                     : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-100 transition"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // =============== MAIN RENDER ===============
//   return (
//     <div className="w-full bg-white relative">
//       {/* Desktop Table */}
//       {!isMobile ? (
//         <div className="w-full overflow-x-auto">
//           <table className="min-w-full border-collapse bg-[#F1F6F6] rounded-md">
//             <thead>
//               <tr className="border-b border-[#898787]">
//                 {allHeaders.map((header, i) => (
//                   <th key={i} className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
//                     {formatHeader(header)}
//                   </th>
//                 ))}
//                 {actions.length > 0 && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
//                     Actions
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map((row, index) => (
//                 <tr key={index} className="border-b border-[#898787] hover:bg-[#e6eded]">
//                   {allHeaders.map((key, i) => (
//                     <td key={i} className="px-6 py-3 text-sm text-[#000000] whitespace-nowrap">
//                       {renderCell(row, key, index)}
//                     </td>
//                   ))}
//                   {actions.length > 0 && (
//                     <td className="px-6 py-3 text-sm">
//                       <div className="flex items-center gap-3">
//                         {actions
//                           .filter(a => a.showAsIcon)
//                           .map((action, i) => (
//                             <button
//                               key={i}
//                               onClick={(e) => handleActionClick(e, action, row, index)}
//                               className="text-gray-600 hover:text-gray-900"
//                               title={action.label}
//                             >
//                               {action.icon}
//                             </button>
//                           ))}
//                         {actions.some(a => a.useDropdown) && (
//                           <>
//                             <button
//                               onClick={(e) => toggleMenu(index, e)}
//                               className="text-gray-600 hover:text-gray-900 text-lg font-bold"
//                             >
//                               ⋮
//                             </button>
//                             {renderDropdown(row, index)}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         /* Mobile Cards - same as before */
//         <div className="space-y-4">
//           {currentData.map((row, index) => (
//             <div key={index} className="border border-[#898787] rounded-md p-4 bg-[#F1F6F6] shadow-sm">
//               <div className="space-y-3">
//                 {allHeaders.map((key, i) => (
//                   <div key={i} className="flex justify-between border-b border-[#898787] pb-2">
//                     <span className="text-sm font-semibold text-[#1B504E] w-1/3">{formatHeader(key)}:</span>
//                     <span className="text-sm text-gray-800 text-right flex-1">
//                       {renderCell(row, key, index)}
//                     </span>
//                   </div>
//                 ))}
//                 {actions.length > 0 && (
//                   <div className="flex justify-end pt-3 gap-3">
//                     {actions.filter(a => a.showAsIcon).map((a, i) => (
//                       <button key={i} onClick={(e) => handleActionClick(e, a, row, index)}>
//                         {a.icon}
//                       </button>
//                     ))}
//                     {actions.some(a => a.useDropdown) && (
//                       <button onClick={(e) => toggleMenu(index, e)} className="text-xl">⋮</button>
//                     )}
//                     {renderDropdown(row, index)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* PAGINATION — ALWAYS SHOWS WHEN pagination={true} */}
//       <PaginationControls />
//     </div>
//   );
// };

// export default Table;





// // src/components/mainComponents/Table.jsx
// import React, { useState, useEffect, useRef } from "react";
// import ReactDOM from "react-dom";

// const Table = ({ 
//   data, 
//   actions = [], 
//   extraColumns = [], 
//   pagination = false,
//   defaultPageSize = 10,
//   excludeColumns = []   // ← NAYA PROP ADDED
// }) => {
//   const [isOpen, setIsOpen] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const menuRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(defaultPageSize);

//   const formatHeader = (header) => {
//     return String(header)
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase());
//   };

//   // Baaki sab functions same...

//   const handleActionClick = (e, action, row, index) => {
//     e.preventDefault();
//     if (action.onClick) action.onClick(row, index);
//     setIsOpen(null);
//   };

//   const toggleMenu = (index, e) => {
//     // same as before
//     if (isOpen === index) {
//       setIsOpen(null);
//     } else {
//       const button = e.currentTarget;
//       const rect = button.getBoundingClientRect();
//       const dropdownWidth = 192;
//       let leftPosition = rect.left + window.scrollX + 10;

//       if (leftPosition + dropdownWidth > window.innerWidth) {
//         leftPosition = rect.right + window.scrollX - dropdownWidth;
//       }

//       setDropdownPosition({
//         top: rect.bottom + window.scrollY + 8,
//         left: leftPosition,
//       });
//       setIsOpen(index);
//     }
//   };

//   const handleClickOutside = (e) => {
//     if (isOpen !== null && menuRef.current && !menuRef.current.contains(e.target)) {
//       setIsOpen(null);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [data, pageSize]);

//   // =============== PAGINATION LOGIC ===============
//   const totalItems = data?.length || 0;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = Math.min(startIndex + pageSize, totalItems);
//   const currentData = pagination ? data.slice(startIndex, endIndex) : data;

//   // Page numbers logic same...
//   const generatePageNumbers = () => {
//     const pages = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else if (currentPage <= 4) {
//       pages.push(1, 2, 3, 4, 5, "...", totalPages);
//     } else if (currentPage >= totalPages - 3) {
//       pages.push(1, "...");
//       for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
//     }
//     return pages;
//   };

//   const pageNumbers = generatePageNumbers();

//   // =============== NO DATA ===============
//   if (!data || data.length === 0) {
//     return <p className="text-gray-500 text-center py-8">No data available</p>;
//   }

//   // =============== HEADERS WITH EXCLUDE LOGIC ===============
//   const baseHeaders = data[0]
//     ? Object.keys(data[0])
//         .filter((key) => key !== "followUps" && key !== "_id")
//     : [];

//   // Extra columns ke headers
//   const extraHeaders = extraColumns.map((col) => col.header);

//   // Sab headers combine karo
//   let allHeaders = [...baseHeaders, ...extraHeaders];

//   // Unique rakho (just in case)
//   allHeaders = [...new Set(allHeaders)];

//   // Ab excludeColumns apply karo (case-insensitive compare for safety)
//   allHeaders = allHeaders.filter(
//     (header) => !excludeColumns.some(
//       (excluded) => excluded.toLowerCase() === header.toLowerCase()
//     )
//   );

//   // =============== REST SAME ===============
//   const renderDropdown = (row, index) => {
//     // same as before
//     if (isOpen === index && actions.some(a => a.useDropdown)) {
//       return ReactDOM.createPortal(
//         <div
//           ref={menuRef}
//           className="absolute w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//           style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
//         >
//           {actions
//             .filter(a => a.useDropdown)
//             .map((action, i) => (
//               <button
//                 key={i}
//                 onClick={(e) => handleActionClick(e, action, row, index)}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 {action.label}
//               </button>
//             ))}
//         </div>,
//         document.body
//       );
//     }
//     return null;
//   };

//   const renderCell = (row, key, index) => {
//     const extraCol = extraColumns.find(col => 
//       col.header.toLowerCase() === key.toLowerCase()
//     );
//     return extraCol ? extraCol.render(row, index) : row[key] ?? "-";
//   };

//   // PaginationControls same rahega...

//   const PaginationControls = () => {
//     if (!pagination) return null;

//     return (
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
//         <div className="text-sm font-medium text-gray-700">
//           Showing <span className="text-[#398C89] font-bold">{startIndex + 1}</span> to{" "}
//           <span className="text-[#398C89] font-bold">{endIndex}</span> of{" "}
//           <span className="text-[#398C89] font-bold">{totalItems}</span> entries
//         </div>

//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-3">
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] outline-none"
//             >
//               {[5, 10, 25, 50, 100].map(size => (
//                 <option key={size} value={size}>{size}</option>
//               ))}
//             </select>
//             <span className="text-sm text-gray-600">per page</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-100 transition"
//             >
//               Previous
//             </button>

//             {pageNumbers.map((page, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => typeof page === "number" && setCurrentPage(page)}
//                 disabled={page === "..."}
//                 className={`w-11 h-11 text-sm font-semibold rounded-lg border transition ${
//                   page === currentPage
//                     ? "bg-[#398C89] text-white border-[#398C89] shadow-md"
//                     : page === "..."
//                     ? "text-gray-500 cursor-default border-transparent"
//                     : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-100 transition"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // =============== MAIN RENDER ===============
//   return (
//     <div className="w-full bg-white relative">
//       {/* Desktop Table */}
//       {!isMobile ? (
//         <div className="w-full overflow-x-auto">
//           <table className="min-w-full border-collapse bg-[#F1F6F6] rounded-md">
//             <thead>
//               <tr className="border-b border-[#898787]">
//                 {allHeaders.map((header, i) => (
//                   <th key={i} className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
//                     {formatHeader(header)}
//                   </th>
//                 ))}
//                 {actions.length > 0 && (
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
//                     Actions
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map((row, index) => (
//                 <tr key={index} className="border-b border-[#898787] hover:bg-[#e6eded]">
//                   {allHeaders.map((key, i) => (
//                     <td key={i} className="px-6 py-3 text-sm text-[#000000] whitespace-nowrap">
//                       {renderCell(row, key, index)}
//                     </td>
//                   ))}
//                   {actions.length > 0 && (
//                     <td className="px-6 py-3 text-sm">
//                       {/* actions same */}
//                       <div className="flex items-center gap-3">
//                         {actions.filter(a => a.showAsIcon).map((action, i) => (
//                           <button
//                             key={i}
//                             onClick={(e) => handleActionClick(e, action, row, index)}
//                             className="text-gray-600 hover:text-gray-900"
//                             title={action.label}
//                           >
//                             {action.icon}
//                           </button>
//                         ))}
//                         {actions.some(a => a.useDropdown) && (
//                           <>
//                             <button
//                               onClick={(e) => toggleMenu(index, e)}
//                               className="text-gray-600 hover:text-gray-900 text-lg font-bold"
//                             >
//                               ⋮
//                             </button>
//                             {renderDropdown(row, index)}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         // Mobile view mein bhi allHeaders use kar rahe hain jo exclude ho chuke hain
//         <div className="space-y-4">
//           {currentData.map((row, index) => (
//             <div key={index} className="border border-[#898787] rounded-md p-4 bg-[#F1F6F6] shadow-sm">
//               <div className="space-y-3">
//                 {allHeaders.map((key, i) => (
//                   <div key={i} className="flex justify-between border-b border-[#898787] pb-2">
//                     <span className="text-sm font-semibold text-[#1B504E] w-1/3">{formatHeader(key)}:</span>
//                     <span className="text-sm text-gray-800 text-right flex-1">
//                       {renderCell(row, key, index)}
//                     </span>
//                   </div>
//                 ))}
//                 {actions.length > 0 && (
//                   <div className="flex justify-end pt-3 gap-3">
//                     {actions.filter(a => a.showAsIcon).map((a, i) => (
//                       <button key={i} onClick={(e) => handleActionClick(e, a, row, index)}>
//                         {a.icon}
//                       </button>
//                     ))}
//                     {actions.some(a => a.useDropdown) && (
//                       <button onClick={(e) => toggleMenu(index, e)} className="text-xl">⋮</button>
//                     )}
//                     {renderDropdown(row, index)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <PaginationControls />
//     </div>
//   );
// };

// export default Table;






// src/components/mainComponents/Table.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Table = ({
  data,
  actions = [],
  extraColumns = [],
  pagination = false,
  defaultPageSize = 10,
  excludeColumns = [],
  serverPagination = false,           // ← NAYA PROP ADDED
  totalServerItems = 0,               // ← NAYA PROP ADDED
  currentServerPage = 1,              // ← NAYA PROP ADDED
  onPageChange,                       // ← NAYA PROP ADDED
  onPageSizeChange                    // ← NAYA PROP ADDED
}) => {
  const [isOpen, setIsOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(serverPagination ? currentServerPage : 1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Sync with prop when in server mode
  useEffect(() => {
    if (serverPagination) {
      setCurrentPage(currentServerPage);
    }
  }, [currentServerPage, serverPagination]);

  const formatHeader = (header) => {
    return String(header)
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Baaki sab functions same...

  const handleActionClick = (e, action, row, index) => {
    e.preventDefault();
    if (action.onClick) action.onClick(row, index);
    setIsOpen(null);
  };

  const toggleMenu = (index, e) => {
    // same as before
    if (isOpen === index) {
      setIsOpen(null);
    } else {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const dropdownWidth = 192;
      let leftPosition = rect.left + window.scrollX + 10;

      if (leftPosition + dropdownWidth > window.innerWidth) {
        leftPosition = rect.right + window.scrollX - dropdownWidth;
      }

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: leftPosition,
      });
      setIsOpen(index);
    }
  };

  const handleClickOutside = (e) => {
    if (isOpen !== null && menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(null);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Only reset page when data changes in client-side pagination mode
  useEffect(() => {
    if (!serverPagination) {
      setCurrentPage(1);
    }
  }, [data, serverPagination]);

  // =============== PAGINATION LOGIC ===============
  const totalItems = serverPagination ? totalServerItems : (data?.length || 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Indices for display info
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Data slicing logic
  const currentData = pagination && !serverPagination
    ? data.slice(startIndex, endIndex)
    : data;

  const handlePageChange = (page) => {
    if (typeof page !== "number") return;
    setCurrentPage(page);
    if (serverPagination && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size) => {
    const newSize = Number(size);
    setPageSize(newSize);
    setCurrentPage(1);
    if (serverPagination && onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  // Page numbers logic same...
  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // =============== NO DATA ===============
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center py-8">No data available</p>;
  }

  // =============== HEADERS WITH EXCLUDE LOGIC ===============
  const baseHeaders = data[0]
    ? Object.keys(data[0])
      .filter((key) => key !== "followUps" && key !== "_id")
    : [];

  // Extra columns ke headers
  const extraHeaders = extraColumns.map((col) => col.header);

  // Sab headers combine karo
  let allHeaders = [...baseHeaders, ...extraHeaders];

  // Unique rakho (just in case)
  allHeaders = [...new Set(allHeaders)];

  // Ab excludeColumns apply karo (case-insensitive compare for safety)
  allHeaders = allHeaders.filter(
    (header) => !excludeColumns.some(
      (excluded) => excluded.toLowerCase() === header.toLowerCase()
    )
  );

  // =============== REST SAME ===============
  const renderDropdown = (row, index) => {
    // same as before
    if (isOpen === index && actions.some(a => a.useDropdown)) {
      return ReactDOM.createPortal(
        <div
          ref={menuRef}
          className="absolute w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
        >
          {actions
            .filter(a => a.useDropdown)
            .map((action, i) => (
              <button
                key={i}
                onClick={(e) => handleActionClick(e, action, row, index)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {action.label}
              </button>
            ))}
        </div>,
        document.body
      );
    }
    return null;
  };

  const renderCell = (row, key, index) => {
    const extraCol = extraColumns.find(col =>
      col.header.toLowerCase() === key.toLowerCase()
    );
    return extraCol ? extraCol.render(row, index) : row[key] ?? "-";
  };

  // PaginationControls same rahega...

  const PaginationControls = () => {
    if (!pagination) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm font-medium text-gray-700">
          Showing <span className="text-[#398C89] font-bold">{startIndex + 1}</span> to{" "}
          <span className="text-[#398C89] font-bold">{endIndex}</span> of{" "}
          <span className="text-[#398C89] font-bold">{totalItems}</span> entries
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] outline-none"
            >
              {[5, 10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-100 transition"
            >
              Previous
            </button>

            {pageNumbers.map((page, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(page)}
                disabled={page === "..."}
                className={`w-11 h-11 text-sm font-semibold rounded-lg border transition ${page === currentPage
                    ? "bg-[#398C89] text-white border-[#398C89] shadow-md"
                    : page === "..."
                      ? "text-gray-500 cursor-default border-transparent"
                      : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =============== MAIN RENDER ===============
  return (
    <div className="w-full bg-white relative">
      {/* Desktop Table */}
      {!isMobile ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse bg-[#F1F6F6] rounded-md">
            <thead>
              <tr className="border-b border-[#898787]">
                {allHeaders.map((header, i) => (
                  <th key={i} className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
                    {formatHeader(header)}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr key={index} className="border-b border-[#898787] hover:bg-[#e6eded]">
                  {allHeaders.map((key, i) => (
                    <td key={i} className="px-6 py-3 text-sm text-[#000000] whitespace-nowrap">
                      {renderCell(row, key, index)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-3 text-sm">
                      {/* actions same */}
                      <div className="flex items-center gap-3">
                        {actions.filter(a => a.showAsIcon).map((action, i) => (
                          <button
                            key={i}
                            onClick={(e) => handleActionClick(e, action, row, index)}
                            className="text-gray-600 hover:text-gray-900"
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                        {actions.some(a => a.useDropdown) && (
                          <>
                            <button
                              onClick={(e) => toggleMenu(index, e)}
                              className="text-gray-600 hover:text-gray-900 text-lg font-bold"
                            >
                              ⋮
                            </button>
                            {renderDropdown(row, index)}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile view mein bhi allHeaders use kar rahe hain jo exclude ho chuke hain
        <div className="space-y-4">
          {currentData.map((row, index) => (
            <div key={index} className="border border-[#898787] rounded-md p-4 bg-[#F1F6F6] shadow-sm">
              <div className="space-y-3">
                {allHeaders.map((key, i) => (
                  <div key={i} className="flex justify-between border-b border-[#898787] pb-2">
                    <span className="text-sm font-semibold text-[#1B504E] w-1/3">{formatHeader(key)}:</span>
                    <span className="text-sm text-gray-800 text-right flex-1">
                      {renderCell(row, key, index)}
                    </span>
                  </div>
                ))}
                {actions.length > 0 && (
                  <div className="flex justify-end pt-3 gap-3">
                    {actions.filter(a => a.showAsIcon).map((a, i) => (
                      <button key={i} onClick={(e) => handleActionClick(e, a, row, index)}>
                        {a.icon}
                      </button>
                    ))}
                    {actions.some(a => a.useDropdown) && (
                      <button onClick={(e) => toggleMenu(index, e)} className="text-xl">⋮</button>
                    )}
                    {renderDropdown(row, index)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <PaginationControls />
    </div>
  );
};

export default Table;