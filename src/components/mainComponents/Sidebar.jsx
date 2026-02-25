// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { ChevronDown } from 'lucide-react';
// import SalesNav from '../salesperson/Navigation';
// import TeleNav from '../TeleCaller/Navigation';
// import AdminNav from '../Admin/Navigation';
// import SuperAdminNav from '../SuperAdmin/Navigation';
// import DoctorNav from '../Doctor/Navigation';
// import AdvocateNav from '../Advocate/Navigation';
// import ExpertNav from '../Expert/Navigation';
// import { useAuth } from '../../hooks/useAuth';
// import { usePermissions } from '../../hooks/usePermissions';

// const Sidebar = ({ onNavClick, isOpen, toggleSidebar }) => {
//   const { user } = useAuth();
//   const { permissionsLoading } = usePermissions();
//   const role = user?.role;

//   // State to manage open submenus
//   const [openSubMenus, setOpenSubMenus] = useState({});

//   // Toggle submenu
//   const toggleSubMenu = (index) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   // Role-based navigation filtering
//   const getFilteredNavItems = () => {
//     // Both admin and super_admin use the same permission-filtered navigation
//     if (role === 'admin' || role === 'super_admin') {
//       return AdminNav(); // AdminNav is now a function that filters based on permissions
//     }

//     const roleBasedItems = {
//       sales: SalesNav,
//       salesman: SalesNav, // Alias for salesman
//       telecaller: TeleNav,
//       superadmin: SuperAdminNav, // Keep separate for future use if needed
//       doctor: DoctorNav, // Doctor navigation with permissions
//       advocate: AdvocateNav, // Advocate navigation with permissions
//       expert: ExpertNav, // Expert navigation with permissions
//     };

//     // For non-admin roles, check if it's a function (new permission-based nav) or array (old static nav)
//     const navComponent = roleBasedItems[role];
//     if (typeof navComponent === 'function') {
//       return navComponent(); // Call the function to get permission-filtered navigation
//     }
//     return navComponent || []; // Return array or empty array if undefined
//   };

//   const filteredNavItems = getFilteredNavItems();

//   return (
//     <>
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-screen transform ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 md:top-20 md:h-[calc(100vh-96px)] bg-[#E8EFEF] w-56 shadow-[0_0_1px_0px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-in-out z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
//       >
//         {/* Navigation Links */}
//         <nav className="space-y-2 pt-4 md:pt-2 pb-12">

//           {permissionsLoading ? (
//             <div className="flex items-center justify-center p-4">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
//               <span className="ml-2 text-sm text-gray-600">Loading...</span>
//             </div>
//           ) : filteredNavItems.length === 0 ? (
//             <div className="p-4 text-sm text-gray-500">
//               No navigation items available
//             </div>
//           ) : (
//             filteredNavItems.map((item, index) => (
//             <div key={index}>
//               {/* Main Menu Item */}
//               <NavLink
//                 to={item.path}
//                 end
//                 className={({ isActive }) =>
//                   `flex items-center justify-between py-4 px-8 text-[#000000c5] font-semibold md:text-sm hover:bg-[#398C8947] rounded-lg ${
//                     isActive && !item.subMenu ? 'bg-[#398C8947]' : ''
//                   }`
//                 }
//                 onClick={() => {
//                   if (item.subMenu) {
//                     toggleSubMenu(index);
//                   } else {
//                     onNavClick(item.label.toLowerCase().replace(' ', '-'));
//                     if (window.innerWidth < 768) toggleSidebar();
//                   }
//                 }}
//               >
//                 <div className="flex items-center">
//                   {/* <item.icon className="w-5 h-5 mr-2" /> */}
//                   <span>{item.label}</span>
//                 </div>
//                 {item.subMenu && (
//                   <ChevronDown
//                     className={`w-5 h-5 transform transition-transform ${
//                       openSubMenus[index] ? 'rotate-180' : ''
//                     }`}
//                   />
//                 )}
//               </NavLink>
//               {/* Submenu */}
//               {item.subMenu && openSubMenus[index] && (
//                 <div className="ml-4 bg-[#E8EFEF] space-y-2">
//                   {item.subMenu.map((subItem, subIndex) => (
//                     <NavLink
//                       key={subIndex}
//                       to={subItem.path}
//                       end
//                       className={({ isActive }) =>
//                         `block py-2   px-8 text-gray-700 font-medium md:text-sm hover:bg-[#C4CFCE5C] rounded-lg ${
//                           isActive ? 'bg-[#C4CFCE5C]' : ''
//                         }`
//                       }
//                       onClick={() => {
//                         onNavClick(subItem.label.toLowerCase().replace(' ', '-'));
//                         if (window.innerWidth < 768) toggleSidebar();
//                       }}
//                     >
//                       {subItem.label}
//                     </NavLink>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))
//           )}
//         </nav>
//       </div>

//       {/* Overlay for mobile when sidebar is open */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
//           onClick={() => toggleSidebar()}
//         ></div>
//       )}
//     </>
//   );
// };

// export default Sidebar;





// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { ChevronDown } from 'lucide-react';
// import SalesNav from '../salesperson/Navigation';
// import TeleNav from '../TeleCaller/Navigation';
// import AdminNav from '../Admin/Navigation';
// import SuperAdminNav from '../SuperAdmin/Navigation';
// import DoctorNav from '../Doctor/Navigation';
// import AdvocateNav from '../Advocate/Navigation';
// import ExpertNav from '../Expert/Navigation';
// import { useAuth } from '../../hooks/useAuth';
// import { usePermissions } from '../../hooks/usePermissions';

// const Sidebar = ({ onNavClick, isOpen, toggleSidebar }) => {
//   const { user } = useAuth();
//   const { permissionsLoading } = usePermissions();
//   const role = user?.role;

//   // State to manage open submenus
//   const [openSubMenus, setOpenSubMenus] = useState({});

//   // Toggle submenu
//   const toggleSubMenu = (index) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   // Role-based navigation filtering
//   const getFilteredNavItems = () => {
//     // Super admin ke liye separate navigation
//     if (role === 'super_admin' || role === 'superadmin') {
//       return SuperAdminNav; // Direct static array use karein
//     }

//     // Admin ke liye permission-based navigation
//     if (role === 'admin') {
//       return AdminNav(); // AdminNav function call karein
//     }

//     // Baaki roles ke liye
//     const roleBasedItems = {
//       sales: SalesNav,
//       salesman: SalesNav,
//       telecaller: TeleNav,
//       doctor: DoctorNav,
//       advocate: AdvocateNav,
//       expert: ExpertNav,
//     };

//     const navComponent = roleBasedItems[role];
//     if (typeof navComponent === 'function') {
//       return navComponent();
//     }
//     return navComponent || [];
//   };

//   const filteredNavItems = getFilteredNavItems();

//   return (
//     <>
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-screen transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
//           } md:translate-x-0 md:top-20 md:h-[calc(100vh-96px)] bg-[#E8EFEF] w-56 shadow-[0_0_1px_0px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-in-out z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
//       >
//         {/* Navigation Links */}
//         <nav className="space-y-2 pt-4 md:pt-2 pb-12">

//           {permissionsLoading ? (
//             <div className="flex items-center justify-center p-4">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
//               <span className="ml-2 text-sm text-gray-600">Loading...</span>
//             </div>
//           ) : filteredNavItems.length === 0 ? (
//             <div className="p-4 text-sm text-gray-500">
//               No navigation items available
//             </div>
//           ) : (
//             filteredNavItems.map((item, index) => (
//               <div key={index}>
//                 {/* Main Menu Item */}
//                 <NavLink
//                   to={item.path}
//                   end
//                   className={({ isActive }) =>
//                     `flex items-center justify-between py-4 px-8 text-[#000000c5] font-semibold md:text-sm hover:bg-[#398C8947] rounded-lg ${isActive && !item.subMenu ? 'bg-[#398C8947]' : ''
//                     }`
//                   }
//                   onClick={() => {
//                     if (item.subMenu) {
//                       toggleSubMenu(index);
//                     } else {
//                       onNavClick(item.label.toLowerCase().replace(' ', '-'));
//                       if (window.innerWidth < 768) toggleSidebar();
//                     }
//                   }}
//                 >
//                   <div className="flex items-center">
//                     <span>{item.label}</span>
//                   </div>
//                   {item.subMenu && (
//                     <ChevronDown
//                       className={`w-5 h-5 transform transition-transform ${openSubMenus[index] ? 'rotate-180' : ''
//                         }`}
//                     />
//                   )}
//                 </NavLink>
//                 {/* Submenu */}
//                 {item.subMenu && openSubMenus[index] && (
//                   <div className="ml-4 bg-[#E8EFEF] space-y-2">
//                     {item.subMenu.map((subItem, subIndex) => (
//                       <NavLink
//                         key={subIndex}
//                         to={subItem.path}
//                         end
//                         className={({ isActive }) =>
//                           `block py-2   px-8 text-gray-700 font-medium md:text-sm hover:bg-[#C4CFCE5C] rounded-lg ${isActive ? 'bg-[#C4CFCE5C]' : ''
//                           }`
//                         }
//                         onClick={() => {
//                           onNavClick(subItem.label.toLowerCase().replace(' ', '-'));
//                           if (window.innerWidth < 768) toggleSidebar();
//                         }}
//                       >
//                         {subItem.label}
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </nav>
//       </div>

//       {/* Overlay for mobile when sidebar is open */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
//           onClick={() => toggleSidebar()}
//         ></div>
//       )}
//     </>
//   );
// };

// export default Sidebar;










import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SalesNav from '../salesperson/Navigation';
import TeleNav from '../TeleCaller/Navigation';
import AdminNav from '../Admin/Navigation';
import SuperAdminNav from '../SuperAdmin/Navigation';
import DoctorNav from '../Doctor/Navigation';
import AdvocateNav from '../Advocate/Navigation';
import ExpertNav from '../Expert/Navigation';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

const Sidebar = ({ onNavClick, isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const { permissionsLoading } = usePermissions();
  const role = user?.role;

  // State to manage open submenus
  const [openSubMenus, setOpenSubMenus] = useState({});

  // Toggle submenu
  const toggleSubMenu = (index) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Role-based navigation filtering
  const getFilteredNavItems = () => {
    // Super admin ke liye - sab kuch show karo without permission check
    if (role === 'super_admin' || role === 'superadmin') {
      return SuperAdminNav(); // Function call karo
    }

    // Admin ke liye permission-based navigation
    if (role === 'admin') {
      return AdminNav(); // Permission-based filtering
    }

    // Baaki roles ke liye
    const roleBasedItems = {
      sales: SalesNav,
      salesman: SalesNav,
      telecaller: TeleNav,
      doctor: DoctorNav,
      advocate: AdvocateNav,
      expert: ExpertNav,
    };

    const navComponent = roleBasedItems[role];
    if (typeof navComponent === 'function') {
      return navComponent();
    }
    return navComponent || [];
  };

  const filteredNavItems = getFilteredNavItems();

  // Navigation item render function
  const renderNavItem = (item, index) => (
    <div key={index}>
      {/* Main Menu Item */}
      <NavLink
        to={item.path}
        end
        className={({ isActive }) =>
          `flex items-center justify-between py-4 px-8 text-[#000000c5] font-semibold md:text-sm hover:bg-[#398C8947] rounded-lg ${isActive && !item.subMenu ? 'bg-[#398C8947]' : ''
          }`
        }
        onClick={() => {
          if (item.subMenu) {
            toggleSubMenu(index);
          } else {
            onNavClick(item.label.toLowerCase().replace(' ', '-'));
            if (window.innerWidth < 768) toggleSidebar();
          }
        }}
      >
        <div className="flex items-center">
          <span>{item.label}</span>
        </div>
        {item.subMenu && (
          <ChevronDown
            className={`w-5 h-5 transform transition-transform ${openSubMenus[index] ? 'rotate-180' : ''
              }`}
          />
        )}
      </NavLink>

      {/* Submenu */}
      {item.subMenu && openSubMenus[index] && (
        <div className="ml-4 bg-[#E8EFEF] space-y-2">
          {item.subMenu.map((subItem, subIndex) => (
            <NavLink
              key={subIndex}
              to={subItem.path}
              end
              className={({ isActive }) =>
                `block py-2 px-8 text-gray-700 font-medium md:text-sm hover:bg-[#C4CFCE5C] rounded-lg ${isActive ? 'bg-[#C4CFCE5C]' : ''
                }`
              }
              onClick={() => {
                onNavClick(subItem.label.toLowerCase().replace(' ', '-'));
                if (window.innerWidth < 768) toggleSidebar();
              }}
            >
              {subItem.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:top-20 md:h-[calc(100vh-96px)] bg-[#E8EFEF] w-56 shadow-[0_0_1px_0px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-in-out z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
      >
        {/* Navigation Links */}
        <nav className="space-y-2 pt-4 md:pt-2 pb-12">
          {permissionsLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
              <span className="ml-2 text-sm text-gray-600">Loading navigation...</span>
            </div>
          ) : filteredNavItems.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No navigation items available for your role
            </div>
          ) : (
            filteredNavItems.map((item, index) => renderNavItem(item, index))
          )}
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;