

// // src/components/DateInput.jsx
// import React from 'react';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";

// const DateInput = ({ label, value = '', onChange, name, minDate, maxDate, ...rest }) => {
//   // Safe parse - empty ya invalid ko handle karega
//   const safeParseDate = (input) => {
//     if (!input || input === '') return null;
//     if (input instanceof Date && !isNaN(input)) return input;
//     if (typeof input === 'string') {
//       const trimmed = input.trim();
//       if (trimmed === '') return null;
//       const parts = trimmed.split('-');
//       if (parts.length === 3) {
//         let day, month, year;
//         if (parts[0].length === 4) [year, month, day] = parts.map(Number);
//         else [day, month, year] = parts.map(Number);
//         if (day && month && year) {
//           const date = new Date(year, month - 1, day);
//           if (!isNaN(date.getTime())) return date;
//         }
//       }
//     }
//     return null;
//   };

//   const formatToDDMMYYYY = (date) => {
//     if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
//     return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
//   };

//   const selectedDate = safeParseDate(value);
//   const minDateObj = minDate ? safeParseDate(minDate) : null;
//   const maxDateObj = maxDate ? safeParseDate(maxDate) : null;

//   const handleChange = (date) => {
//     if (!date) {
//       onChange({ target: { name, value: '' } }); // Clear karne pe empty string
//       return;
//     }
//     const formatted = formatToDDMMYYYY(date);
//     onChange({ target: { name, value: formatted } });
//   };

//   // Dynamic years
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 151 }, (_, i) => currentYear - 75 + i);

//   const months = ["January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"];

//   const renderCustomHeader = ({
//     date,
//     changeYear,
//     changeMonth,
//     decreaseMonth,
//     increaseMonth,
//     prevMonthButtonDisabled,
//     nextMonthButtonDisabled,
//   }) => (
//     <div className="bg-gray-50">
//       <div className="flex items-center justify-between px-4 py-3">
//         <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} type="button"
//           className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-full transition disabled:opacity-50">
//           ‹
//         </button>

//         <div className="flex gap-3">
//           <select
//             value={months[date.getMonth()]}
//             onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
//             className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
//           >
//             {months.map((m) => <option key={m}>{m}</option>)}
//           </select>

//           <select
//             value={date.getFullYear()}
//             onChange={({ target: { value } }) => changeYear(Number(value))}
//             className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
//           >
//             {years.map((y) => <option key={y}>{y}</option>)}
//           </select>
//         </div>

//         <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} type="button"
//           className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-full transition disabled:opacity-50">
//           ›
//         </button>
//       </div>

//       <div className="flex justify-center gap-6 px-4 py-3 border-t border-gray-200">
//         <button type="button" onClick={() => handleChange(null)}
//           className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition">
//           Clear
//         </button>
//         <button type="button" onClick={() => handleChange(new Date())}
//           className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition">
//           Today
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="w-full">
//       {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
//       <DatePicker
//         selected={selectedDate}
//         onChange={handleChange}
//         dateFormat="dd-MM-yyyy"
//         placeholderText="dd-mm-yyyy"
//         minDate={minDateObj}
//         maxDate={maxDateObj}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
//         wrapperClassName="w-full"
//         renderCustomHeader={renderCustomHeader}
//         showMonthDropdown
//         showYearDropdown
//         dropdownMode="select"
//         autoComplete="off"
//         {...rest}
//       />
//     </div>
//   );
// };

// export default DateInput;








// src/components/DateInput.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DateInput = ({ 
  label, 
  value = '', 
  onChange, 
  name, 
  minDate, 
  maxDate, 
  returnFormat = 'dd-mm-yyyy',  // Default dd-mm-yyyy
  ...rest 
}) => {
  // Safe parse - string ya Date object handle karega
  const safeParseDate = (input) => {
    if (!input || input === '') return null;
    if (input instanceof Date && !isNaN(input)) return input;
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (trimmed === '') return null;
      const parts = trimmed.split('-');
      if (parts.length === 3) {
        let day, month, year;
        if (parts[0].length === 4) {
          // yyyy-mm-dd
          [year, month, day] = parts.map(Number);
        } else {
          // dd-mm-yyyy
          [day, month, year] = parts.map(Number);
        }
        if (day && month && year) {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) return date;
        }
      }
    }
    return null;
  };

  // Format date according to returnFormat
  const formatDateOutput = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (returnFormat === 'yyyy-mm-dd') {
      return `${year}-${month}-${day}`;
    }
    // Default dd-mm-yyyy
    return `${day}-${month}-${year}`;
  };

  const selectedDate = safeParseDate(value);
  const minDateObj = minDate ? safeParseDate(minDate) : null;
  const maxDateObj = maxDate ? safeParseDate(maxDate) : null;

  const handleChange = (date) => {
    const formatted = formatDateOutput(date);
    if (name) {
      onChange({ target: { name, value: formatted } });
    } else {
      onChange(formatted);
    }
  };

  // Dynamic years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 151 }, (_, i) => currentYear - 75 + i);

  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="bg-gray-50">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} type="button"
          className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-full transition disabled:opacity-50">
          ‹
        </button>

        <div className="flex gap-3">
          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
          >
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>

          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(Number(value))}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
          >
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>

        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} type="button"
          className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-full transition disabled:opacity-50">
          ›
        </button>
      </div>

      <div className="flex justify-center gap-6 px-4 py-3 border-t border-gray-200">
        <button type="button" onClick={() => handleChange(null)}
          className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition">
          Clear
        </button>
        <button type="button" onClick={() => handleChange(new Date())}
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition">
          Today
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd-MM-yyyy"  // Display hamesha dd-mm-yyyy
        placeholderText="dd-mm-yyyy"
        minDate={minDateObj}
        maxDate={maxDateObj}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
        wrapperClassName="w-full"
        renderCustomHeader={renderCustomHeader}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        autoComplete="off"
        {...rest}
      />
    </div>
  );
};

export default DateInput;