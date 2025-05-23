import { CropCard } from '../components/CropCard';

export default function RightCard() {
  return (
    <div className="w-full md:w-1/2 bg-white rounded-lg p-3 flex flex-col justify-start h-full space-y-3">
      {/* Header */}
      <div className="w-full bg-[#F4F4F4] rounded-sm px-4 py-2 flex justify-between items-center text-sm">
        <span className="text-black font-semibold">Plot Details</span>
        <span className="text-[#69727D]">0.11 acres</span>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <CropCard cropName="Corn" />
        <CropCard cropName="Corn" />
        <CropCard cropName="Corn" />
        <CropCard cropName="Corn" />
      </div>
    </div>
  );
}