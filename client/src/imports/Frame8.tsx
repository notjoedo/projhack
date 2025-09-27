export default function Frame8() {
  return (
    <div className="backdrop-blur-[14.1px] backdrop-filter bg-[rgba(255,255,255,0.5)] relative rounded-[8px] size-full">
      <div aria-hidden="true" className="absolute border border-[#caafc5] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[12px] relative size-full">
          <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-black text-nowrap tracking-[-0.1504px] whitespace-pre">SEARCH ENGINE</p>
        </div>
      </div>
    </div>
  );
}