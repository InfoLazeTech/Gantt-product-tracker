import React, { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaCube,
  FaUser,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";
import {
  format,
  parseISO,
  eachDayOfInterval,
  min,
  max,
  isValid,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";
import timelineLogo from "../assets/timelineLogo.png";
import factory from "../assets/factory.jpeg";
import { fetchCustomerProduct } from "../redux/features/productSlice";
import { toast } from "react-toastify";
import { FiPackage } from "react-icons/fi";
import FullPageLoader from "../components/Loader/Loader";

const POFilter = () => {
  const [poNumber, setPONumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [filteredPOs, setFilteredPOs] = useState([]);
  const [dayWidth, setDayWidth] = useState(85);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const { checkProduct, loading } = useSelector((state) => state.product);
  console.log("checkProduct", checkProduct);

  const didFetchRef = useRef(false);
  const todayRef = useRef(null);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    dispatch(
      fetchCustomerProduct({ PONumber: "PO-00018", RefNumber: "D29704" })
    )
      .unwrap()
      .then((res) => console.log("Fetched on load:", res))
      .catch((err) => console.error("Error on load:", err));
  }, [dispatch]);

  const handleSearch = () => {
    if (!poNumber.trim() || !referenceNumber.trim()) {
      toast.error("Please enter both PO Number and Reference Number");
      return;
    }

    dispatch(
      fetchCustomerProduct({ PONumber: poNumber, RefNumber: referenceNumber })
    )
      .unwrap()
      .then((data) => {
        if (
          data?.PONumber === poNumber &&
          data?.RefNumber === referenceNumber &&
          data?.recipeId &&
          data?.processes?.length > 0
        ) {
          const recipeProcesses = data.recipeId?.processes?.map((proc) => {
            const matchingProcess = data.processes.find(
              (p) => p._id === proc._id
            );
            return {
              id: proc._id,
              name: proc.name,
              startDate:
                proc.startDateTime ||
                matchingProcess?.startDate ||
                data.startDate,
              endDate:
                proc.endDateTime ||
                matchingProcess?.endDate ||
                data.estimatedEndDate,
              status: proc.status || matchingProcess?.status || "In Progress",
              processId: proc._id,
            };
          });

          setFilteredPOs([
            {
              PONumber: data.PONumber,
              RefNumber: data.RefNumber,
              customerName: data.customerName,
              processes: data.processes,
              recipes: recipeProcesses,
              recipe: data.recipeId,
              startDate: data.startDate,
              estimatedEndDate: data.estimatedEndDate,
            },
          ]);
        } else {
          toast.error("Invalid PO Number or Reference Number");
          setFilteredPOs([]);
        }
        // Optionally use this if you want to use API result instead of dummy list
        // setFilteredPOs([data]);
      })
      .catch((err) => {
        console.error("API error:", err);
        toast.error("Error fetching PO data");
        setFilteredPOs([]);
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const po = filteredPOs[0];

  const poStart = po?.startDate ? parseISO(po.startDate) : null;
  const poEnd = po?.estimatedEndDate ? parseISO(po.estimatedEndDate) : null;

  const processDates =
    po?.processes?.flatMap((p) => {
      const start = p.startDateTime ? parseISO(p.startDateTime) : null;
      const end = p.endDateTime ? parseISO(p.endDateTime) : null;
      return [start, end].filter((d) => isValid(d));
    }) || [];

  const allDates = [
    ...(poStart ? [poStart] : []),
    ...(poEnd ? [poEnd] : []),
    ...processDates,
  ];

  const minDate = allDates.length ? min(allDates) : new Date();
  const maxDate = allDates.length ? max(allDates) : minDate;

  const allDays = eachDayOfInterval({ start: minDate, end: maxDate });
  useEffect(() => {
    const idealDayWidth = 85;
    const taskColumnWidth = 200;
    const screenWidth = window.innerWidth - taskColumnWidth;

    const visibleDays = allDays.length;

    if (visibleDays > 0) {
      const totalChartWidth = visibleDays * idealDayWidth;

      const newWidth =
        totalChartWidth < screenWidth
          ? screenWidth / visibleDays
          : idealDayWidth;

      setDayWidth(newWidth);
    }
  }, [allDays]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCustomerProduct());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // console.log("minDate", minDate);

  const isPendingPO = !po?.processes?.some(
    (p) => p.startDateTime && p.endDateTime
  );

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={timelineLogo} alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-blue-700">
            Production Order Timeline
          </h1>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={
            token ? handleLogout : () => (window.location.href = "/login")
          }
        >
          <FaUser />
          {token ? "Logout" : "Login"}
        </button>
      </div>

      {/* Banner Section */}
      <div className="w-full py-18 px-4 flex items-center justify-center">
        <div className="relative w-full">
          <div
            className="w-full h-[300px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${factory})` }}
          ></div>
          <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2 bg-white/70 p-6 rounded-xl max-w-4xl w-full shadow-lg backdrop-blur-md z-10">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Search Production Orders
            </h2>
            <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-end">
              {/* PO Number */}
              <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  PO Number
                </label>
                <div className="relative">
                  <FaSearch className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter PO Number"
                    value={poNumber}
                    onChange={(e) => setPONumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Reference Number */}
              <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Reference Number
                </label>
                <div className="relative">
                  <FaCube className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Reference Number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 w-full md:w-auto justify-end md:justify-start mt-4 md:mt-0">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md text-sm shadow-md transition-all duration-200"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setPONumber("");
                    setReferenceNumber("");
                    setFilteredPOs([]);
                  }}
                  className="flex items-center gap-2 border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100 shadow-sm transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v6h6M20 20v-6h-6M4 20l16-16"
                    />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-40">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <FullPageLoader />
          </div>
        ) : filteredPOs.length > 0 ? (
          <div className="mt-20 px-4 mb-16">
            {/* Table */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-4 text-blue-700">
                PO Summary Table
              </h2>
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-3 font-semibold">PO Number</th>
                      <th className="px-5 py-3 font-semibold">
                        Reference Number
                      </th>
                      <th className="px-5 py-3 font-semibold">Customer</th>
                      <th className="px-5 py-3 font-semibold">Recipe Name</th>
                      <th className="px-5 py-3 font-semibold">Process Name</th>
                      <th className="px-5 py-3 font-semibold">Start Date</th>
                      <th className="px-5 py-3 font-semibold">End Date</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredPOs.map((po) => {
                      const recipeName = po.recipe?.name || "-";
                      console.log("recipeId:", recipeName);
                      const processes = po.processes || [];
                      return processes.map((processObj, index) => {
                        const process = processObj.processId;
                        const startISO = processObj.startDateTime;
                        const endISO = processObj.endDateTime;

                        const startDate = startISO
                          ? format(parseISO(startISO), "yyyy-MM-dd")
                          : "-";
                        const endDate = endISO
                          ? format(parseISO(endISO), "yyyy-MM-dd")
                          : "-";

                        // ✅ Dynamically determine status
                        const today = new Date();
                        const start = startISO ? parseISO(startISO) : null;
                        const end = endISO ? parseISO(endISO) : null;

                        let status = "Pending";
                        if (start && end) {
                          if (today >= start && today <= end) {
                            status = "In Progress";
                          } else if (today > end) {
                            status = "Completed";
                          }
                        }

                        return (
                          <tr
                            key={processObj._id}
                            className="hover:bg-gray-50 transition duration-150"
                          >
                            {/* Only first row shows PO info */}
                            {index === 0 ? (
                              <>
                                <td
                                  rowSpan={processes.length}
                                  className="px-5 py-3 text-center align-middle text-gray-800 font-medium border-r"
                                >
                                  {po.PONumber}
                                </td>
                                <td
                                  rowSpan={processes.length}
                                  className="px-5 py-3 text-center align-middle text-gray-800 border-r"
                                >
                                  {po.RefNumber}
                                </td>
                                <td
                                  rowSpan={processes.length}
                                  className="px-5 py-3 text-center align-middle text-gray-700 border-r"
                                >
                                  {po.customerName}
                                </td>
                                <td
                                  rowSpan={processes.length}
                                  className="px-5 py-3 text-center align-middle text-gray-700 border-r"
                                >
                                  {recipeName}
                                </td>
                              </>
                            ) : (
                              <>
                                {/* <td className="px-5 py-3"></td> */}
                                {/* <td className="px-5 py-3"></td> */}
                                {/* <td className="px-5 py-3"></td> */}
                                {/* <td className="px-5 py-3"></td> */}
                              </>
                            )}

                            {/* Process info always shown */}
                            <td className="px-5 py-3 text-gray-700">
                              {process?.name || "-"}
                            </td>
                            <td className="px-5 py-3 text-gray-700">
                              {startDate}
                            </td>
                            <td className="px-5 py-3 text-gray-700">
                              {endDate}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                  status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gantt Chart */}
            {/* ⚠️ Pending PO Box */}
            {isPendingPO && (
              <div className="flex justify-center w-full">
                <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded p-4 mb-4 shadow-md text-sm max-w-xl w-full">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <strong className="block mb-1 text-base">
                        PO Pending
                      </strong>
                      <p>
                        This Production Order is still Pending. Work has not
                        started yet.
                      </p>
                      <p>No processes have a start date assigned.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!isPendingPO && (
              <div className="p-4 text-sm">
                {/* Header */}
                <div className="bg-gray-100 p-2 sm:p-4 rounded-md shadow-md border">
                  <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-2 flex items-center gap-2 ">
                    <FiPackage className="w-5 h-5 text-blue-600" />
                    Production Order:
                    <span className="text-blue-500"> {po.PONumber}</span>
                  </h2>
                  <div className="flex flex-wrap justify-between w-full text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
                      <FaUser className="text-blue-500" />
                      <span>Customer: {po.customerName || "-"}</span>
                    </div>
                    <div className="flex items-center gap-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>Start: {format(minDate, "dd MMM yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>Delivery: {format(maxDate, "dd MMM yyyy")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <FaChartBar className="text-green-500" />
                      <span>Progress: –</span>
                    </div>
                  </div>
                </div>

                {/* Gantt Chart Grid */}

                <div className="w-full overflow-x-auto overflow-y-hidden ">
                  {/* Date Header */}
                  <div
                    className="grid border-b bg-gray-100 text-gray-800 font-semibold"
                    style={{
                      gridTemplateColumns: `200px repeat(${allDays.length}, ${dayWidth}px)`,
                      minWidth: `${200 + allDays.length * dayWidth}px`, // ensure full-width or more
                    }}
                  >
                    <div className="sticky left-0 z-20 bg-gray-100 border-r px-4 py-2 flex items-center justify-start">
                      Task Name
                    </div>
                    <div
                      className="col-span-full text-center py-2 border-l border-b  font-semibold"
                      style={{ gridColumn: `2 / span ${allDays.length}` }}
                    >
                      {format(minDate, "dd MMM yyyy")} –{" "}
                      {format(maxDate, "dd MMM yyyy")}
                    </div>

                    <div className="sticky left-0 z-20 border-r bg-gray-100 " />
                    {allDays.map((date, idx) => {
                      const isToday =
                        format(date, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd");
                      return (
                        <div
                          key={idx}
                          className={`text-center py-2 px-2 border-l text-xs sm:text-sm transition-all duration-150 ease-in-out ${
                            isToday
                              ? "bg-blue-600 text-white font-semibold shadow-md rounded-t-md"
                              : "bg-gray-50 text-gray-800"
                          }`}
                          style={{ width: `${dayWidth}px` }}
                        >
                          <div>{format(date, "dd")}</div>
                          <div className="uppercase text-[10px] tracking-wide">
                            {format(date, "MMM")}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Process Rows */}
                  {po?.processes?.map((process) => {
                    const hasDates =
                      process.startDateTime && process.endDateTime;

                    const start = hasDates
                      ? parseISO(process.startDateTime)
                      : null;
                    const end = hasDates ? parseISO(process.endDateTime) : null;
                    const startStr = hasDates
                      ? format(start, "yyyy-MM-dd")
                      : null;
                    const endStr = hasDates ? format(end, "yyyy-MM-dd") : null;

                    const today = format(new Date(), "yyyy-MM-dd");

                    return (
                      <div
                        key={process._id}
                        className=" grid border-b min-h-[42px] bg-white"
                        style={{
                          gridTemplateColumns: `200px repeat(${allDays.length}, ${dayWidth}px)`,
                          minWidth: `${200 + allDays.length * dayWidth}px`, // ensure full-width or more
                        }}
                      >
                        {/* Process Name */}
                        <div className="sticky left-0 z-10 bg-white text-blue-700 border-r font-medium px-4 py-2 flex justify-center items-center min-h-[42px] hover:bg-blue-100 transition-colors duration-150">
                          {process.processId?.name || "-"}
                        </div>

                        {/* Bar Cells */}

                        {allDays.map((day, idx) => {
                          const currentDate = format(day, "yyyy-MM-dd");

                          const showBar =
                            currentDate >= startStr && currentDate <= endStr;
                          const isStart = currentDate === startStr;

                          // 💡 Calculate status based on date range
                          let barColor = "bg-gray-400";
                          if (today >= startStr && today <= endStr) {
                            barColor = "bg-yellow-400"; // In Progress
                          } else if (today > endStr) {
                            barColor = "bg-green-500"; // Completed
                          }

                          return (
                            <div
                              key={idx}
                              className="relative border-l h-10 flex items-center justify-center bg-white"
                              style={{ width: `${dayWidth}px` }}
                            >
                              {showBar && (
                                <div className="group absolute inset-0 flex items-center justify-center">
                                  <div
                                    className={`h-6 w-full rounded shadow text-white text-xs px-1 text-center flex items-center justify-center ${barColor}`}
                                  >
                                    {isStart}
                                  </div>

                                  {/* Tooltip */}
                                  <div className="absolute left-0 -translate-x-full top-[30%] -translate-y-1/2 z-50 hidden group-hover:block bg-white text-black text-xs p-2 shadow-xl rounded border w-max whitespace-nowrap">
                                    <div>
                                      <strong>Process:</strong>{" "}
                                      {process.processId?.name || "-"}
                                    </div>
                                    <div>
                                      <strong>Start:</strong>{" "}
                                      {format(start, "dd MMM yyyy")}
                                    </div>
                                    <div>
                                      <strong>End:</strong>{" "}
                                      {format(end, "dd MMM yyyy")}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            No Production Orders Found
          </div>
        )}
      </div>
    </>
  );
};

export default POFilter;
