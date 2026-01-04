import { useEffect, useState } from 'react'
import './App.css'

function Navigation({setPage}) {
  return (
    <div className='w-screen flex flex-row gap-20 h-14 justify-center p-4 font-bold bg-amber-500 text-black text-sm md:text-base'>
      <h1><a className="cursor-pointer transform transition duration-200 hover:scale-105 hover:text-red-500 inline-block" onClick={() => setPage(1)}>Push Up Challenge</a></h1>
      <h1><a className="cursor-pointer transform transition duration-200 hover:scale-105 hover:text-red-500 inline-block" onClick={() => setPage(2)}>Pull Up Challenge</a></h1>
      <h1><a className="cursor-pointer transform transition duration-200 hover:scale-105 hover:text-red-500 inline-block" onClick={() => setPage(3)}>About</a></h1>
    </div>
  )
}

const getDayOfYear = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

function PushUpPage(){
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const initialPushUps = dayOfYear;
  

  const [remaining, setRemaining] = useState(() => {
    const savedPushups = localStorage.getItem('remainingPushUps');
    const savedDate = localStorage.getItem('pushUpDate');
    const todayStr = new Date().toDateString(); // e.g. "Sat Jan 04 2026"
    
    if (savedPushups !== null && savedDate === todayStr) {
      return parseInt(savedPushups);
    } else {
      // Either no saved pushups, or it's a new day → reset
      localStorage.setItem('pushUpDate', todayStr);
      return initialPushUps; // or initialPushUps
  }
});

  useEffect(() => {
    localStorage.setItem("remainingPushUps", remaining);
  }, [remaining]);

  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const done = parseInt(input);
    if (!isNaN(done)){
      const left = remaining-done;
      if(left < 0){
        setRemaining(0);
      } else {
        setRemaining(prev => Math.min(initialPushUps, prev-done))
      }
      setInput('');
    }
  }


  return (
    <div className='flex flex-col justify-center items-center text-3xl h-full'>
      <h1 className='text-5xl text-green-500 font-bold mb-16 transform transition duration-200 hover:scale-105'>Push Up Challenge</h1>
      <p>Push Ups Left Today:</p>
      <p className='text-amber-300 m-4 text-6xl transform transition duration-200 md:hover:scale-110'><b>{remaining ? remaining : <p className='text-3xl text-green-400 text-center'>Congratulations! You have finished your daily pushups!</p>}</b></p>
      <p>Input number of Push Ups done:</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2 items-center p-4'>
        <div className='flex flex-row text-3xl gap-2'>
          <div className='w-14 text-center items-center flex justify-center text-amber-200 transform transition duration-200 hover:scale-105'><button type='button' className='cursor-pointer' onClick={() => setInput(Number(input)-10)}>-10</button></div>
          {/* <div className='w-14 text-center items-center flex justify-center text-amber-200'><button type='button' className='cursor-pointer' onClick={() => setInput(Number(input)-5)}>-5</button></div> */}
          <div className='w-14 text-center items-center flex justify-center text-amber-200 transform transition duration-200 hover:scale-105'><button type='button' className='cursor-pointer' onClick={() => setInput(Number(input)-1)}>-1</button></div>
          <input type='number' className='w-20 text-center m-2 bg-gray-900 rounded-md text-amber-300' id='pushup-input' value={input} onChange={(e) => setInput(e.target.value)}></input>
          <div className='w-14 text-center items-center flex justify-center text-amber-200 transform transition duration-200 hover:scale-105'><button type='button' className='cursor-pointer' onClick={() => setInput(Number(input)+1)}>+1</button></div>
          {/* <div className='w-14 text-center items-center flex justify-center text-amber-200'><button type='button' className='cursor-pointer' onClick={() => setInput(Number(input)+5)}>+5</button></div> */}
          <div className='w-14 text-center items-center flex justify-center text-amber-200 transform transition duration-200 hover:scale-105'><button type='button' className='cursor-pointer' onClick={() => setInput(Number(input)+10)}>+10</button></div>
        </div>
        <div className='flex flex-row gap-4'>
        <button type='button' className='cursor-pointer bg-red-400 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105' onClick={() => setRemaining(initialPushUps)}>Reset🔄</button>
        <button type='submit' className='cursor-pointer bg-amber-300 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105'>Confirm</button>
        
        </div>
      </form>
    </div>
  )
}


function getWeekOfYearISO(date) {
  const yearStart = new Date(date.getFullYear(), 0, 1); // Jan 1
  const dayOfWeek = yearStart.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const dayOffset = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1; // make Monday=0
  const firstWeekEnd = 7 - dayOffset; // number of days in first partial week

  const dayOfYear = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24)) + 1;

  if (dayOfYear <= firstWeekEnd) {
    return 1; // first week
  } else {
    return Math.ceil((dayOfYear - firstWeekEnd) / 7) + 1;
  }
}

function PullUpPage() {
  const today = new Date();
  const currentWeek = getWeekOfYearISO(today);
  const initialPullUps = currentWeek; // 1 pull up per week

  const [remaining, setRemaining] = useState(() => {
    const savedPullUps = localStorage.getItem('remainingPullUps');
    const savedDate = localStorage.getItem('pullUpDate');
    const todayStr = new Date().toDateString();

    if (savedPullUps !== null && savedDate === todayStr) {
      return parseInt(savedPullUps);
    } else {
      localStorage.setItem('pullUpDate', todayStr);
      return initialPullUps;
    }
  });

  useEffect(() => {
    localStorage.setItem('remainingPullUps', remaining);
  }, [remaining]);

  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const done = parseInt(input);
    if (!isNaN(done)) {
      const left = remaining - done;
      setRemaining(prev => Math.max(0, Math.min(initialPullUps, prev - done)));
      setInput('');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-3xl h-full">
      <h1 className='text-5xl text-orange-400 font-bold mb-16 transform transition duration-200 hover:scale-105'>Pull Up Challenge</h1>
      <p>Pull Ups Left Today:</p>
      <p className="text-amber-300 m-4 text-6xl transform transition duration-200 md:hover:scale-110">
        <b>
          {remaining > 0 ? remaining : <p className="text-3xl text-green-400">Congratulations! You have finished your daily pull ups!</p>}
        </b>
      </p>
      <p>Input number of Pull Ups done:</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center p-4">
        <div className="flex flex-row text-3xl gap-2">
          <div className="w-14 text-center items-center flex justify-center text-amber-200 transform transition duration-200 hover:scale-105">
            <button type="button" className="cursor-pointer" onClick={() => setInput(Number(input) - 1)}>-1</button>
          </div>
          <input type="number" className="w-20 text-center m-2 bg-gray-900 rounded-md text-amber-300" value={input} onChange={(e) => setInput(e.target.value)} />
          <div className="w-14 text-center items-center flex justify-center text-amber-200 transform transition duration-200 hover:scale-105">
            <button type="button" className="cursor-pointer" onClick={() => setInput(Number(input) + 1)}>+1</button>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <button type="button" className="cursor-pointer bg-red-400 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105" onClick={() => setRemaining(initialPullUps)}>Reset🔄</button>
          <button type="submit" className="cursor-pointer bg-amber-300 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105">Confirm</button>
        </div>
      </form>
    </div>
  );
}


function AboutPage(){
  return (
    <div className='flex flex-col items-center max-w-6xl gap-4 text-white p-4'>
    <h1 className='text-3xl font-bold text-green-500'>Push Up Challenge (Easy - Intermediate)</h1>
    <p className='text-lg text-justify'>The push up challenge is a challenge where you do a Push Up for every day of the year. For instance, January 31st is Day 31 of the year which means you do 31 Push ups. Meanwhile, February 2nd is the 33rd day of the year, so you do 33 Push Ups. You are able to split these push ups into multiple sets of varying amounts (eg. 3 sets of 11 for 33 push ups, or 2 sets of 15 and 1 set of 3 pushups). The only rule in this challenge is to consistently use <a href="https://www.youtube.com/watch?v=WDIpL0pjun0" className='text-blue-400'>GOOD Push Up Form</a>. You are able to substitute regular Push Ups for harder or easier variations depending on your needs.</p><br/><br/>
    <h1 className='text-3xl font-bold text-orange-400'>Pull Up Challenge (Intermediate - Hard)</h1>
    <p className='text-lg text-justify'>The pull up challenge is a challenge where you do a Pull Up for every week of the year. For instance, January 1st - January 4th 2026 is considered the first week of the year, therefore you do 1 pull up everyday for that week. You are able to split these pull ups into multiple sets of varying amounts (eg. 3 sets of 11 for 33 pull ups, or 2 sets of 15 and 1 set of 3 pull ups). The only rule in this challenge is to consistently use <a href='https://www.youtube.com/watch?v=eGo4IYlbE5g' className='text-blue-400'>GOOD Pull Up Form</a>. You are able to substitute regular Pull Ups for harder or easier variations depending on your needs.</p>
    </div>
  )
}

function App() {
  const [page, setPage] = useState(1)
  useEffect(() => {
    console.log(page);
  },[page])

  return (
    <div className='h-screen flex flex-col'>
    <Navigation setPage={setPage}/>
    <div className='flex-1 flex m-0 items-center justify-center'>
      {page === 1 && <PushUpPage/>}
      {page === 2 && <PullUpPage/>}
      {page === 3 && <AboutPage/>}
    </div>
    </div>
  )
}

export default App
