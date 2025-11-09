"use client";

interface SchoolCardProps {
  name: string;
  city: string;
  district: string;
  phoneNumber1?: string;
}

export default function SchoolCard({
  name,
  city,
  district,
  phoneNumber1,
}: SchoolCardProps) {

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{name}</h3>

      <div className="space-y-2 text-gray-600">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div>
            <p className="font-medium">{city}</p>
            <p className="text-sm">{district}</p>
          </div>
        </div>

        {phoneNumber1 && (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
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
            <a
              href={`tel:${phoneNumber1}`}
              className="hover:text-blue-600 transition-colors"
            >
              {phoneNumber1}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
