"use client";

import { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import SchoolModal from "./SchoolModal";
import { SchoolFormData } from "../schemas/schema";
import { schoolsApi } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

ModuleRegistry.registerModules([AllCommunityModule]);

interface SchoolGridRow {
  id: string;
  name?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  phoneNumber3?: string;
  schoolsWebSite?: string;
  establishedYear?: number;
  creator?: {
    email: string;
  };
  address: {
    city: string;
    street: string;
    zipCode: string;
    district: string;
  };
}

export default function ReadOnlySchoolsGrid() {
  const tForm = useTranslations("form");
  const tAddress = useTranslations("address");
  const { role } = useAuth(); // Get user role for showing/hiding creator column
  const [rowData, setRowData] = useState<SchoolGridRow[]>([]);
  const [filteredRowData, setFilteredRowData] = useState<SchoolGridRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolFormData | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingSchool, setIsFetchingSchool] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fullData: any[] = await schoolsApi.getAll();

      const gridData: SchoolGridRow[] = fullData.map((school) => ({
        id: school.id!,
        name: school.name,
        phoneNumber1: school.phoneNumber1,
        phoneNumber2: school.phoneNumber2,
        phoneNumber3: school.phoneNumber3,
        schoolsWebSite: school.schoolsWebSite,
        establishedYear: school.establishedYear,
        creator: school.creator ? { email: school.creator.email } : undefined,
        address: {
          city: school.address?.city ?? "",
          district: school.address?.district ?? "",
          street: school.address?.street ?? "",
          zipCode: school.address?.zipCode ?? "",
        },
      }));

      setRowData(gridData);
      setFilteredRowData(gridData);
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError(err instanceof Error ? err.message : "Failed to load schools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // Filter schools based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRowData(rowData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const digitsOnly = query.replace(/\D/g, "");

    const filtered = rowData.filter((school) => {
      const nameMatch = school.name?.toLowerCase().includes(query);
      const cityMatch = school.address.city.toLowerCase().includes(query);

      const districtKey = school.address.district.toLowerCase();
      let districtTranslated = "";
      try {
        districtTranslated = school.address.district
          ? tAddress(school.address.district).toLowerCase()
          : "";
      } catch {
        districtTranslated = "";
      }
      const districtMatch = districtKey.includes(query) || districtTranslated.includes(query);

      const phone1Digits = school.phoneNumber1 ? school.phoneNumber1.replace(/\D/g, "") : "";
      const phone2Digits = school.phoneNumber2 ? school.phoneNumber2.replace(/\D/g, "") : "";
      const phone3Digits = school.phoneNumber3 ? school.phoneNumber3.replace(/\D/g, "") : "";

      const phoneMatch =
        (digitsOnly && phone1Digits.includes(digitsOnly)) ||
        (digitsOnly && phone2Digits.includes(digitsOnly)) ||
        (digitsOnly && phone3Digits.includes(digitsOnly));

      return nameMatch || cityMatch || districtMatch || phoneMatch;
    });

    setFilteredRowData(filtered);
  }, [searchQuery, rowData, tAddress]);

  // Keyboard navigation for grid - only view mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen || document.activeElement?.tagName === "INPUT") {
        return;
      }

      const maxIndex = filteredRowData.length - 1;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedRowIndex((prev) => {
            const newIndex = Math.min(prev + 1, maxIndex);
            setTimeout(() => {
              const selectedNode = gridApi?.getDisplayedRowAtIndex(newIndex);
              if (selectedNode) {
                gridApi?.ensureIndexVisible(newIndex, "middle");
              }
            }, 0);
            return newIndex;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedRowIndex((prev) => {
            const newIndex = Math.max(prev - 1, 0);
            setTimeout(() => {
              const selectedNode = gridApi?.getDisplayedRowAtIndex(newIndex);
              if (selectedNode) {
                gridApi?.ensureIndexVisible(newIndex, "middle");
              }
            }, 0);
            return newIndex;
          });
          break;
        case "Enter":
          e.preventDefault();
          if (filteredRowData[selectedRowIndex]) {
            openModal(filteredRowData[selectedRowIndex]);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedRowIndex, filteredRowData, modalOpen, gridApi]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const openModal = async (school: SchoolGridRow) => {
    try {
      setIsFetchingSchool(true);
      const fullData = await fetchFullSchoolById(school.id);
      setSelectedSchool(fullData);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching school:", error);
      toast.error("Failed to load school data");
    } finally {
      setIsFetchingSchool(false);
    }
  };

  const columnDefs: ColDef<SchoolGridRow>[] = [
    {
      headerName: "#",
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
      width: 70,
      resizable: false,
      sortable: false,
    },
    {
      headerName: tForm("actions"),
      width: 100,
      resizable: false,
      sortable: false,
      cellRenderer: (params: { data: SchoolGridRow }) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(params.data)}
            className="text-blue-400 hover:text-blue-800 transition-colors focus:outline-none"
          >
            {tForm("view")}
          </button>
        </div>
      ),
      cellClass: "ag-no-focus-outline",
    },
    {
      headerName: tForm("name"),
      field: "name",
      filter: true,
      sortable: true,
      resizable: true,
      flex: 2,
      minWidth: 150,
    },
    {
      headerName: tForm("establishedYear"),
      field: "establishedYear",
      filter: true,
      sortable: true,
      resizable: true,
      width: 140,
    },
    {
      headerName: tForm("phoneNumber1"),
      field: "phoneNumber1",
      filter: true,
      sortable: true,
      resizable: true,
      width: 160,
    },
    {
      headerName: tForm("schoolsWebSite"),
      field: "schoolsWebSite",
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: { data: SchoolGridRow }) => {
        const url = params.data?.schoolsWebSite;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            {url}
          </a>
        ) : (
          ""
        );
      },
      filter: true,
    },
    // Created By column - only visible for admins
    ...(role === 'admin' ? [{
      headerName: "Created By",
      field: "creator.email",
      sortable: true,
      resizable: true,
      width: 200,
      filter: true,
      valueFormatter: (params: any) => params.data?.creator?.email || "N/A",
    }] : []),
    {
      headerName: tForm("address"),
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 180,
      valueFormatter: ({ data }) => {
        const city = data?.address?.city ?? "";
        const districtKey = data?.address?.district ?? "";
        try {
          const districtTranslated = districtKey ? tAddress(districtKey) : "";
          return districtTranslated ? `${city}, ${districtTranslated}` : city;
        } catch {
          return city;
        }
      },
      filter: true,
    },
  ];

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => fetchSchools()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!loading && rowData.length === 0) {
    return (
      <div className="w-full px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <svg
            className="w-24 h-24 text-gray-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            {tForm("noSchoolsYet")}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            {tForm("noSchoolsMessage")}
          </p>
        </div>
      </div>
    );
  }

  const showNoSearchResults = searchQuery && filteredRowData.length === 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-8">
      <div className="mb-4">
        <label htmlFor="school-search" className="sr-only">
          {tForm("searchPlaceholder")}
        </label>
        <input
          id="school-search"
          type="text"
          placeholder={tForm("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label={tForm("searchPlaceholder")}
        />
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600" role="status" aria-live="polite">
            {tForm("searchResults")}: {filteredRowData.length}
          </p>
        )}
        {!showNoSearchResults && (
          <p className="mt-2 text-xs text-gray-500 italic">
            Keyboard shortcuts: ↑↓ Navigate • Enter View
          </p>
        )}
      </div>

      {showNoSearchResults ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <svg
            className="w-20 h-20 text-gray-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {tForm("noSearchResults")}
          </h2>
          <p className="text-base text-gray-600 mb-6 max-w-2xl">
            {tForm("noSearchResultsMessage")}
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
          >
            {tForm("clearSearch")}
          </button>
        </div>
      ) : (
        <div className="ag-theme-alpine h-screen" role="region" aria-label="Schools data grid">
          <AgGridReact
            rowData={filteredRowData}
            columnDefs={columnDefs}
            getRowId={(params) => params.data.id}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[20, 50, 100]}
            getRowStyle={(params) => {
              if (params.node.rowIndex === selectedRowIndex) {
                return {
                  background: "#dbeafe",
                  borderLeft: "3px solid #3b82f6",
                  fontWeight: "500",
                };
              }
              return undefined;
            }}
          />
        </div>
      )}

      {isFetchingSchool && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-700 font-medium">{tForm("loadingSchool")}</p>
          </div>
        </div>
      )}

      {modalOpen && selectedSchool && (
        <SchoolModal
          school={selectedSchool}
          mode="view"
          onClose={() => setModalOpen(false)}
          onSave={() => {}}
        />
      )}
    </div>
  );
}

async function fetchFullSchoolById(id: string): Promise<SchoolFormData> {
  return await schoolsApi.getById(id) as SchoolFormData;
}
