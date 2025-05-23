// components/CropCard.tsx
type CropCardProps = {
  cropName: string;
};

export function CropCard({ cropName }: CropCardProps) {
  return (
    <div className="bg-white border border-gray-300/40 rounded-lg px-3 py-2 flex justify-between items-start">
      <div className="flex flex-col">
        <span className="text-[#484848] text-[12px]">Crop Planted:</span>
        <span className="text-[#134F14] text-[20px] font-semibold">{cropName}</span>
      </div>
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-[#134F14]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.125 1.125-4.5L16.862 3.487z"
          />
        </svg>
      </button>
    </div>
  );
}
