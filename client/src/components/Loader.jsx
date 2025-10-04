import useLoading from '../hooks/useLoading';

export default function Loader() {
  const { loading } = useLoading();

  return (
    <div
      className={`absolute top-12 left-1/2 -translate-1/2 transform flex flex-row justify-center items-center bg-gradient-to-r outline outline-neutral-600 rounded-3xl py-1 from-blue-950 to-neutral-950 w-92 ${
        loading ? 'enter-from-top' : 'exit-from-top'
      }`}
    >
      <span className='font-PressStart2P text-white mr-4'>
        Loading Content, Please Wait
      </span>
      <div className='w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin'></div>
    </div>
  );
}
