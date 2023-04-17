export default function PageStatusIndicator({page, currentPage, relative}){
    return (
        <div className={`
                ${currentPage >= page ? 'tw-bg-gradient-to-br tw-from-teal-600/80 tw-to-teal-700/90 ' : 'tw-bg-slate-400 '}
                ${relative == true ? ' tw-relative tw-top-2 ' : ''}
                tw-rounded-full tw-h-5 tw-w-5 tw-shadow-sm `}></div>
    )
}