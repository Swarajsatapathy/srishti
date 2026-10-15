"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/imageUrl";
import type { Reporter } from "@/lib/types";

interface ReportersDirectoryProps {
  reporters: Reporter[];
}

export default function ReportersDirectory({
  reporters,
}: ReportersDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  // Extract unique sorted districts
  const districts = useMemo(() => {
    const set = new Set<string>();
    reporters.forEach((r) => {
      if (r.district && r.district.trim()) {
        set.add(r.district.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [reporters]);

  // Filter reporters based on search query and district
  const filteredReporters = useMemo(() => {
    return reporters.filter((reporter) => {
      // 1. District filter
      if (selectedDistrict !== "all") {
        if (
          !reporter.district ||
          reporter.district.trim() !== selectedDistrict
        ) {
          return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = reporter.name?.toLowerCase().includes(query);
        const designationMatch = reporter.designation
          ?.toLowerCase()
          .includes(query);
        const districtMatch = reporter.district
          ?.toLowerCase()
          .includes(query);
        const idMatch = reporter.reporterId?.toLowerCase().includes(query);

        if (!nameMatch && !designationMatch && !districtMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });
  }, [reporters, selectedDistrict, searchQuery]);

  // Determine section heading
  const headingText = useMemo(() => {
    if (searchQuery.trim()) {
      return `Search results for "${searchQuery.trim()}"`;
    }
    if (selectedDistrict !== "all") {
      return `${selectedDistrict} Reporters`;
    }
    return "All Members";
  }, [searchQuery, selectedDistrict]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("all");
  };

  return (
    <div className="w-full">
      {/* Search and District Filter Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm mb-8">
        <div className="space-y-5">
          {/* 1. Search Members Input */}
          <div>
            <label
              htmlFor="reporter-search"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Search Members
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="reporter-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, district or designation"
                className="w-full pl-11 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 2. View Members (District Filter) */}
          <div>
            <label
              htmlFor="district-filter"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              View Members
            </label>
            <div className="relative">
              <select
                id="district-filter"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer pr-10"
              >
                <option value="all">All Members</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district} Reporters
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="text-center my-8 md:my-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {headingText}
        </h2>
        <p className="text-sm text-gray-500 mt-1.5 font-medium">
          Showing {filteredReporters.length} of {reporters.length} members
        </p>
      </div>

      {/* Zero Results State */}
      {filteredReporters.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center my-6 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8"
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
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            କୌଣସି ସାମ୍ବାଦିକ ମିଳିଲା ନାହିଁ
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            No reporters found matching your search. Please check the spelling or
            clear the filter.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Reporters Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
          {filteredReporters.map((reporter) => {
            const photoUrl = getImageUrl(reporter.photo?.url);

            return (
              <Link
                key={reporter._id}
                href={`/reporters/${reporter._id}`}
                className="block bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 px-5 py-5 md:px-6 md:py-6 cursor-pointer"
              >
                <div className="flex items-center gap-5 md:gap-7">
                  {/* Photo */}
                  <div className="relative shrink-0 w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 rounded-xl overflow-hidden border-2 border-primary bg-gray-100">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={reporter.name}
                        fill
                        className="object-cover object-top"
                        sizes="160px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <svg
                          className="w-14 h-14 text-primary/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-28 md:h-32 w-px bg-gray-200 shrink-0" />

                  {/* Info */}
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                      {reporter.name}
                    </h2>

                    <p className="text-gray-600 font-semibold text-sm md:text-base mt-2">
                      {reporter.designation}
                    </p>

                    {reporter.district && (
                      <p className="text-primary font-bold text-sm md:text-base mt-2">
                        {reporter.district}
                      </p>
                    )}

                    {reporter.phoneNumber && (
                      <p className="text-gray-600 font-medium text-sm md:text-base mt-1.5 flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-primary shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{reporter.phoneNumber}</span>
                      </p>
                    )}

                    {reporter.message && (
                      <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-2">
                        &ldquo;{reporter.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
