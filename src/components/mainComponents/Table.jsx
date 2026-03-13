// // src/components/mainComponents/Table.jsx
// import React, { useState, useEffect, useRef } from "react";
// import ReactDOM from "react-dom";

// const Table = ({
//   data,
//   actions = [],
//   extraColumns = [],
//   excludeColumns = [],
//   columnOrder = [],
//   pagination = false,
//   defaultPageSize = 10
// }) => {
//   const [isOpen, setIsOpen] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const menuRef = useRef(null);
//   const buttonRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(defaultPageSize);

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

//   // Pagination calculations
//   const totalItems = data?.length || 0;
//   const totalPages = Math.ceil(totalItems / pageSize);
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = Math.min(startIndex + pageSize, totalItems);
//   const currentData = pagination ? data?.slice(startIndex, endIndex) : data;

//   // Reset to first page when data changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [data, pageSize]);

//   if (!data || data.length === 0) {
//     return <p className="text-gray-500">No data available</p>;
//   }

//   // SMART COLUMN DETECTION WITH EXCLUDE COLUMNS
//   const baseHeaders = data[0]
//     ? Object.keys(data[0]).filter((key) => {
//         // Exclude known problematic fields
//         if (key === "followUps" || key === "_id") return false;

//         // Exclude columns specified in excludeColumns
//         if (excludeColumns.includes(key)) return false;

//         // Also exclude any field that is an object (not a primitive value)
//         const value = data[0][key];
//         if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
//           return false;
//         }

//         return true;
//       })
//     : [];

//   // COLUMN ORDERING LOGIC - EXTRA COLUMNS CAN BE PLACED ANYWHERE
//   const getAllHeaders = () => {
//     const allHeaders = [...baseHeaders];

//     // Add extra columns at their specified positions
//     extraColumns.forEach(extraCol => {
//       if (columnOrder && columnOrder.length > 0) {
//         const position = columnOrder.indexOf(extraCol.header);
//         if (position !== -1) {
//           // Insert at specific position
//           allHeaders.splice(position, 0, extraCol.header);
//         } else {
//           // Add to end if no position specified
//           allHeaders.push(extraCol.header);
//         }
//       } else {
//         // Add to end if no columnOrder specified
//         allHeaders.push(extraCol.header);
//       }
//     });

//     // Remove duplicates and maintain order
//     const uniqueHeaders = allHeaders.filter((item, index, self) =>
//       self.indexOf(item) === index
//     );

//     // Apply column order if specified
//     if (columnOrder && columnOrder.length > 0) {
//       return uniqueHeaders.sort((a, b) => {
//         const indexA = columnOrder.indexOf(a);
//         const indexB = columnOrder.indexOf(b);

//         if (indexA !== -1 && indexB !== -1) return indexA - indexB;
//         if (indexA !== -1) return -1;
//         if (indexB !== -1) return 1;
//         return uniqueHeaders.indexOf(a) - uniqueHeaders.indexOf(b);
//       });
//     }

//     return uniqueHeaders;
//   };

//   const allHeaders = getAllHeaders();

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

//   const safeRenderValue = (value) => {
//     if (value === null || value === undefined) {
//       return "-";
//     }
//     if (typeof value === "object") {
//       return JSON.stringify(value);
//     }
//     return value;
//   };

//   const renderCellContent = (row, key, index) => {
//     // Check if this is an extra column
//     const extraColumn = extraColumns.find((col) => col.header === key);
//     if (extraColumn) {
//       return extraColumn.render(row, index);
//     }

//     // Regular data column
//     return safeRenderValue(row[key]);
//   };

//   // Pagination controls component
//   // const PaginationControls = () => {
//   //   if (!pagination || totalPages <= 1) return null;

//   //   const pageNumbers = [];
//   //   const maxVisiblePages = 5;

//   //   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//   //   let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//   //   if (endPage - startPage + 1 < maxVisiblePages) {
//   //     startPage = Math.max(1, endPage - maxVisiblePages + 1);
//   //   }

//   //   for (let i = startPage; i <= endPage; i++) {
//   //     pageNumbers.push(i);
//   //   }

//   //   return (
//   //     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
//   //       <div className="text-sm text-gray-600">
//   //         Showing {startIndex + 1} to {endIndex} of {totalItems} entries
//   //       </div>

//   //       <div className="flex items-center gap-2">
//   //         {/* Entries per page selector */}
//   //         <select
//   //           value={pageSize}
//   //           onChange={(e) => setPageSize(Number(e.target.value))}
//   //           className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#157a6e] focus:border-transparent"
//   //         >
//   //           {[5, 10, 25, 50, 100].map(size => (
//   //             <option key={size} value={size}>
//   //               {size}
//   //             </option>
//   //           ))}
//   //         </select>
//   //         <span className="text-sm text-gray-600">per page</span>
//   //       </div>

//   //       <div className="flex items-center gap-1">
//   //         {/* Previous button */}
//   //         <button
//   //           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//   //           disabled={currentPage === 1}
//   //           className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//   //         >
//   //           Previous
//   //         </button>

//   //         {/* First page */}
//   //         {startPage > 1 && (
//   //           <>
//   //             <button
//   //               onClick={() => setCurrentPage(1)}
//   //               className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
//   //             >
//   //               1
//   //             </button>
//   //             {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
//   //           </>
//   //         )}

//   //         {/* Page numbers */}
//   //         {pageNumbers.map(page => (
//   //           <button
//   //             key={page}
//   //             onClick={() => setCurrentPage(page)}
//   //             className={`px-3 py-1 text-sm border rounded ${
//   //               currentPage === page
//   //                 ? 'bg-[#157a6e] text-white border-[#157a6e]'
//   //                 : 'border-gray-300 hover:bg-gray-100'
//   //             }`}
//   //           >
//   //             {page}
//   //           </button>
//   //         ))}

//   //         {/* Last page */}
//   //         {endPage < totalPages && (
//   //           <>
//   //             {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
//   //             <button
//   //               onClick={() => setCurrentPage(totalPages)}
//   //               className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
//   //             >
//   //               {totalPages}
//   //             </button>
//   //           </>
//   //         )}

//   //         {/* Next button */}
//   //         <button
//   //           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//   //           disabled={currentPage === totalPages}
//   //           className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//   //         >
//   //           Next
//   //         </button>
//   //       </div>
//   //     </div>
//   //   );
//   // };






// //   const PaginationControls = () => {
// //   // ONLY check if pagination is enabled — we DON'T hide it even if 1 page
// //   if (!pagination) return null;

// //   // Always calculate (even if totalPages = 1)
// //   const totalPages = Math.ceil(totalItems / pageSize) || 1;
// //   const startIndex = (currentPage - 1) * pageSize;
// //   const endIndex = Math.min(startIndex + pageSize, totalItems);

// //   const generatePageNumbers = () => {
// //     const pages = [];

// //     if (totalPages <= 7) {
// //       // Show all pages if 7 or less
// //       for (let i = 1; i <= totalPages; i++) pages.push(i);
// //     } else if (currentPage <= 4) {
// //       // Start: 1 2 3 4 5 ... last
// //       pages.push(1, 2, 3, 4, 5);
// //       pages.push("...");
// //       pages.push(totalPages);
// //     } else if (currentPage >= totalPages - 3) {
// //       // End: 1 ... last-4 to last
// //       pages.push(1);
// //       pages.push("...");
// //       for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
// //     } else {
// //       // Middle: 1 ... prev current next ... last
// //       pages.push(1);
// //       pages.push("...");
// //       pages.push(currentPage - 1);
// //       pages.push(currentPage);
// //       pages.push(currentPage + 1);
// //       pages.push("...");
// //       pages.push(totalPages);
// //     }
// //     return pages;
// //   };

// //   const pageNumbers = generatePageNumbers();

// //   return (
// //     <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
// //       {/* Left: Showing info */}
// //       <div className="text-sm font-medium text-gray-700">
// //         Showing <span className="text-[#398C89]">{startIndex + 1}</span> to{" "}
// //         <span className="text-[#398C89]">{endIndex}</span> of{" "}
// //         <span className="text-[#398C89]">{totalItems}</span> entries
// //       </div>

// //       <div className="flex items-center gap-6">
// //         {/* Page Size Selector */}
// //         <div className="flex items-center gap-3">
// //           <select
// //             value={pageSize}
// //             onChange={(e) => {
// //               setPageSize(Number(e.target.value));
// //               setCurrentPage(1);
// //             }}
// //             className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] focus:outline-none transition"
// //           >
// //             {[5, 10, 25, 50, 100].map((size) => (
// //               <option key={size} value={size}>
// //                 {size}
// //               </option>
// //             ))}
// //           </select>
// //           <span className="text-sm text-gray-600 font-medium">per page</span>
// //         </div>

// //         {/* Pagination Buttons — ALWAYS VISIBLE */}
// //         <div className="flex items-center gap-2">
// //           <button
// //             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
// //             disabled={currentPage === 1}
// //             className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
// //           >
// //             Previous
// //           </button>

// //           {pageNumbers.map((page, idx) => (
// //             <button
// //               key={idx}
// //               onClick={() => typeof page === "number" && setCurrentPage(page)}
// //               disabled={page === "..."}
// //               className={`w-11 h-11 text-sm font-semibold rounded-lg border transition ${
// //                 page === currentPage
// //                   ? "bg-[#398C89] text-white border-[#398C89] shadow-md"
// //                   : page === "..."
// //                   ? "text-gray-500 cursor-default border-transparent"
// //                   : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
// //               }`}
// //             >
// //               {page}
// //             </button>
// //           ))}

// //           <button
// //             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
// //             disabled={currentPage === totalPages}
// //             className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// const PaginationControls = () => {
//   if (!pagination) return null;

//   const totalPages = Math.ceil(totalItems / pageSize) || 1;
//   const startIdx = (currentPage - 1) * pageSize + 1;
//   const endIdx = Math.min(currentPage * pageSize, totalItems);

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
//       pages.push(currentPage - 1, currentPage, currentPage + 1);
//       pages.push("...");
//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   const pageNumbers = generatePageNumbers();

//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
//       <div className="text-sm font-medium text-gray-700">
//         Showing <span className="text-[#398C89]">{startIdx}</span> to{" "}
//         <span className="text-[#398C89]">{endIdx}</span> of{" "}
//         <span className="text-[#398C89]">{totalItems}</span> entries
//       </div>

//       <div className="flex items-center gap-6">
//         <div className="flex items-center gap-3">
//           <select
//             value={pageSize}
//             onChange={(e) => {
//               setPageSize(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] focus:outline-none transition"
//           >
//             {[10, 20, 25, 50, 100].map((size) => (
//               <option key={size} value={size}>{size}</option>
//             ))}
//           </select>
//           <span className="text-sm text-gray-600 font-medium">per page</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
//           >
//             Previous
//           </button>

//           {pageNumbers.map((page, idx) => (
//             <button
//               key={idx}
//               onClick={() => typeof page === "number" && setCurrentPage(page)}
//               disabled={page === "..."}
//               className={`w-11 h-11 text-sm font-semibold rounded-lg border transition ${
//                 page === currentPage
//                   ? "bg-[#398C89] text-white border-[#398C89] shadow-md"
//                   : page === "..."
//                   ? "text-gray-500 cursor-default border-transparent"
//                   : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
//               }`}
//             >
//               {page}
//             </button>
//           ))}

//           <button
//             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

//   return (
//     <div className="w-full bg-white relative">
//       {isMobile ? (
//         <div className="md:hidden space-y-4">
//           {currentData.map((row, index) => (
//             <div key={index} className="border border-[#898787] rounded-md p-4 bg-[#F1F6F6] shadow-sm">
//               <div className="space-y-3">
//                 {allHeaders.map((key, i) => (
//                   <div key={i} className="flex justify-between items-start border-b border-[#898787] pb-2">
//                     <span className="text-sm font-semibold text-[#1B504E] flex-shrink-0 w-1/3">
//                       {formatHeader(key)}:
//                     </span>
//                     <span className="text-sm text-gray-800 text-right flex-1">
//                       {renderCellContent(row, key, index)}
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
//                             className="text-gray-600 hover:text-gray-900 focus:outline-none"
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
//               {currentData.map((row, index) => (
//                 <tr key={index} className="border-b border-[#898787] hover:bg-[#e6eded]">
//                   {allHeaders.map((key, i) => (
//                     <td key={i} className="px-6 py-2 text-sm text-[#000000] whitespace-nowrap">
//                       {renderCellContent(row, key, index)}
//                     </td>
//                   ))}
//                   {actions.length > 0 && (
//                     <td className="px-6 py-2 text-sm whitespace-nowrap">
//                       <div className="relative">
//                         {actions.some((action) => action.useDropdown) ? (
//                           <>
//                             <button
//                               onClick={(e) => toggleMenu(index, e)}
//                               className="text-gray-600 hover:text-gray-900 focus:outline-none"
//                             >
//                               ⋮
//                             </button>
//                             {renderDropdown(row, index)}
//                           </>
//                         ) : (
//                           <div className="flex space-x-2">
//                             {actions
//                               .filter((action) => action.showAsIcon)
//                               .map((action, aIndex) => (
//                                 <button
//                                   key={aIndex}
//                                   onClick={(e) => handleActionClick(e, action, row, index)}
//                                   className="text-gray-600 hover:text-gray-900"
//                                   title={action.label}
//                                 >
//                                   {action.icon}
//                                 </button>
//                               ))}
//                           </div>
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

//       {/* Pagination Controls */}
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
  excludeColumns = [],
  columnOrder = [],
  pagination = false,
  defaultPageSize = 10,
  showSrNo = false,                   // NEW: Show serial number column
  columns = null,                     // NEW: Explicit columns definition
  customRowRender = null,             // NEW: Custom row rendering function
  serverPagination = false,           // NEW: Server-side mode
  totalServerItems = 0,               // NEW: Total count from backend
  currentServerPage = 1,              // NEW: Current page from parent
  onPageChange,                       // NEW: Callback for page change
  onPageSizeChange                    // NEW: Callback for size change
}) => {
  const [isOpen, setIsOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // LOCAL STATES
  const [currentPage, setCurrentPage] = useState(currentServerPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // TOTAL ITEMS & PAGES
  const totalItems = serverPagination ? totalServerItems : data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // SYNC SERVER PAGE & PAGE SIZE
  useEffect(() => {
    if (serverPagination) {
      setCurrentPage(currentServerPage);
    }
  }, [currentServerPage, serverPagination]);

  // Sync pageSize when parent changes it (for server pagination)
  useEffect(() => {
    if (serverPagination && onPageSizeChange) {
      // Parent controls pageSize, sync it
      setPageSize(defaultPageSize);
    }
  }, [defaultPageSize, serverPagination, onPageSizeChange]);

  // HANDLE PAGE CHANGE
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (serverPagination && onPageChange) {
      onPageChange(page);
    }
  };

  // HANDLE PAGE SIZE CHANGE
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    if (serverPagination && onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  // HEADER FORMATTING
  const formatHeader = (header) => {
    return String(header)
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // ACTION HANDLERS
  const handleActionClick = (e, action, row, index) => {
    e.preventDefault();
    if (action.onClick) action.onClick(row, index);
    setIsOpen(null);
  };

  const toggleMenu = (index, e) => {
    if (isOpen === index) {
      setIsOpen(null);
    } else {
      const button = e.currentTarget;
      if (button) {
        const rect = button.getBoundingClientRect();
        const dropdownWidth = 192;
        const offsetY = 8;
        const offsetX = 10;
        let leftPosition = rect.left + window.scrollX + offsetX;

        if (leftPosition + dropdownWidth > window.innerWidth) {
          leftPosition = rect.right + window.scrollX - dropdownWidth;
        }

        setDropdownPosition({
          top: rect.bottom + window.scrollY + offsetY,
          left: leftPosition,
        });
      }
      setIsOpen(index);
    }
  };

  const handleClickOutside = (e) => {
    if (isOpen !== null && menuRef.current && !menuRef.current.contains(e.target) && e.target !== buttonRef.current) {
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

  // DATA SLICING (only for client-side)
  const currentData = serverPagination
    ? data
    : data?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || data;

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center py-8">No data available</p>;
  }

  // SMART COLUMN DETECTION
  const baseHeaders = data[0]
    ? Object.keys(data[0]).filter((key) => {
      if (key === "followUps" || key === "_id") return false;
      if (excludeColumns.includes(key)) return false;
      const value = data[0][key];
      if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        return false;
      }
      return true;
    })
    : [];

  const getAllHeaders = () => {
    // If explicit columns are provided, use them directly
    if (columns && columns.length > 0) {
      return columns.map(col => col.header);
    }

    // Start with base headers
    const allHeaders = [...baseHeaders];

    // Add serial number column at the beginning if showSrNo is true
    if (showSrNo) {
      allHeaders.unshift("Sr No");
    }

    extraColumns.forEach((extraCol) => {
      if (columnOrder.length > 0 && columnOrder.includes(extraCol.header)) {
        const position = columnOrder.indexOf(extraCol.header);
        allHeaders.splice(position, 0, extraCol.header);
      } else {
        allHeaders.push(extraCol.header);
      }
    });
    const unique = allHeaders.filter((item, index, self) => self.indexOf(item) === index);
    if (columnOrder.length > 0) {
      return unique.sort((a, b) => {
        const indexA = columnOrder.indexOf(a);
        const indexB = columnOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
    }
    return unique;
  };

  const allHeaders = getAllHeaders();

  const renderDropdown = (row, index) => {
    if (isOpen === index && actions.some((a) => a.useDropdown)) {
      return ReactDOM.createPortal(
        <div ref={menuRef} className="absolute w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50" style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}>
          {actions.filter((a) => a.useDropdown).map((action, i) => (
            <button key={i} onClick={(e) => handleActionClick(e, action, row, index)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {action.label}
            </button>
          ))}
        </div>,
        document.body
      );
    }
    return null;
  };

  const safeRenderValue = (value) => (value === null || value === undefined ? "-" : typeof value === "object" ? JSON.stringify(value) : value);

  const renderCellContent = (row, key, index) => {
    // Handle serial number column
    if (key === "Sr No") {
      // Calculate the actual serial number considering pagination
      const actualIndex = (currentPage - 1) * pageSize + index + 1;
      return actualIndex;
    }

    // If explicit columns are provided, find the matching column definition
    if (columns && columns.length > 0) {
      const colDef = columns.find(col => col.header === key);
      if (colDef) {
        if (colDef.render) return colDef.render(row, index);
        if (colDef.key) return safeRenderValue(row[colDef.key]);
        // Fallback: try to find key by lowercasing header or just use header as key
        return safeRenderValue(row[key] || row[key.toLowerCase()] || row[key.replace(/\s+/g, '')]);
      }
    }

    const extraColumn = extraColumns.find((col) => col.header === key);
    return extraColumn ? extraColumn.render(row, index) : safeRenderValue(row[key]);
  };

  // FULL PAGINATION CONTROLS (WITH 1 2 3 4 5 ... + SELECTOR)
  const PaginationControls = () => {
    if (!pagination) return null;

    const generatePageNumbers = () => {
      const pages = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5); pages.push("..."); pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1); pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1); pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("..."); pages.push(totalPages);
      }
      return pages;
    };

    const pageNumbers = generatePageNumbers();
    const startIdx = (currentPage - 1) * pageSize + 1;
    const endIdx = Math.min(currentPage * pageSize, totalItems);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-700">
          Showing <span className="text-[#398C89]">{startIdx}</span> to{" "}
          <span className="text-[#398C89]">{endIdx}</span> of{" "}
          <span className="text-[#398C89]">{totalItems}</span> entries
        </div>

        <div className="flex items-center gap-6">
          {/* PAGE SIZE SELECTOR */}
          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398C89] focus:outline-none transition"
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600 font-medium">per page</span>
          </div>

          {/* PAGE BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-100 transition"
            >
              Previous
            </button>

            {pageNumbers.map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === "number" && handlePageChange(page)}
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
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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

  // Render function for mobile view
  const renderMobileView = () => (
    <div className="md:hidden space-y-4">
      {currentData.map((row, index) => {
        // If customRowRender is provided and returns content, use the custom row
        if (customRowRender) {
          const customRow = customRowRender(row, index);
          if (customRow) return customRow;
        }

        return (
          <div key={index} className="border border-[#898787] rounded-md p-4 bg-[#F1F6F6] shadow-sm">
            <div className="space-y-3">
              {allHeaders.map((key, i) => (
                // Skip the serial number column in mobile view to avoid clutter
                key !== "Sr No" && (
                  <div key={i} className="flex justify-between items-start border-b border-[#898787] pb-2">
                    <span className="text-sm font-semibold text-[#1B504E] flex-shrink-0 w-1/3">{formatHeader(key)}:</span>
                    <span className="text-sm text-gray-800 text-right flex-1">{renderCellContent(row, key, index)}</span>
                  </div>
                )
              ))}
              {actions.length > 0 && (
                <div className="flex justify-end pt-3">
                  <div className="relative">
                    {actions.some((a) => a.useDropdown) ? (
                      <>
                        <button onClick={(e) => toggleMenu(index, e)} className="text-gray-600 hover:text-gray-900">⋮</button>
                        {renderDropdown(row, index)}
                      </>
                    ) : (
                      <div className="flex space-x-2">
                        {actions.filter((a) => a.showAsIcon).map((action, i) => (
                          <button key={i} onClick={(e) => handleActionClick(e, action, row, index)} title={action.label}>
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render function for desktop view
  const renderDesktopView = () => (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse bg-[#F1F6F6] rounded-md">
        <thead>
          <tr className="border-b border-[#898787]">
            {allHeaders.map((header, i) => (
              <th key={i} className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">
                {formatHeader(header)}
              </th>
            ))}
            {actions.length > 0 && <th className="px-6 py-3 text-left text-sm font-semibold text-[#1B504E] whitespace-nowrap">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => {
            // If customRowRender is provided and returns content, use the custom row
            if (customRowRender) {
              const customRow = customRowRender(row, index);
              if (customRow) return customRow;
            }

            // Default row rendering
            return (
              <tr key={index} className="border-b border-[#898787] hover:bg-[#e6eded]">
                {allHeaders.map((key, i) => (
                  <td key={i} className="px-6 py-2 text-sm text-[#000000] whitespace-nowrap">
                    {renderCellContent(row, key, index)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-2 text-sm whitespace-nowrap">
                    <div className="relative">
                      {actions.some((a) => a.useDropdown) ? (
                        <>
                          <button onClick={(e) => toggleMenu(index, e)} className="text-gray-600 hover:text-gray-900">⋮</button>
                          {renderDropdown(row, index)}
                        </>
                      ) : (
                        <div className="flex space-x-2">
                          {actions.filter((a) => a.showAsIcon).map((action, i) => (
                            <button key={i} onClick={(e) => handleActionClick(e, action, row, index)} title={action.label}>
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full bg-white relative">
      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* PAGINATION */}
      <PaginationControls />
    </div>
  );
};

export default Table;