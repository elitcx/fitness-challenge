import { useEffect, useState } from 'react'
import './App.css'

function Navigation({setPage}) {
  return (
    <div className='w-full flex flex-row gap-6 md:gap-20 h-14 justify-center p-4 font-bold bg-amber-500 text-black text-sm md:text-base text-center items-center'>
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

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function dayOfYearToDate(day, year = new Date().getFullYear()) {
  const date = new Date(year, 0); // Jan 1
  date.setDate(day);
  return date;
}

const toLocalISO = (date) =>
  date.getFullYear() + '-' +
  String(date.getMonth() + 1).padStart(2, '0') + '-' +
  String(date.getDate()).padStart(2, '0');

function PushUpPage(){
  const today = new Date();
  const todayDay = getDayOfYear(today);
  const baseTarget = todayDay;

  const savedDay = Number(localStorage.getItem('pushupLastDay'));
  const savedRemaining = Number(localStorage.getItem('pushupRemaining')) || 0;
  const savedMissedDates = JSON.parse(localStorage.getItem('pushupMissedDates')) || [];

  const [missedDates, setMissedDates] = useState(savedMissedDates);
  

  useEffect(() => {
    if (!savedDay || savedDay >= todayDay) return;

    const newMissed = [];
    const year = today.getFullYear();
    // Yesterday wasn't completed
    if (savedRemaining > 0) {
      const date = dayOfYearToDate(savedDay, year);

      newMissed.push({
        dayOfYear: savedDay,
        dateISO: toLocalISO(date),
        remaining: savedRemaining
      });
    }

    // Fully missed days
    for (let d = savedDay + 1; d < todayDay; d++) {
      const date = dayOfYearToDate(d, year);

      newMissed.push({
        dayOfYear: d,
        dateISO: toLocalISO(date),
        remaining: getDayOfYear(date)
      });
    }

    const existingDays = new Set(savedMissedDates.map(d => d.dayOfYear));
    const filteredNewMissed = newMissed.filter(
      d => !existingDays.has(d.dayOfYear)
    );

    if (filteredNewMissed.length > 0) {
      const updated = [...savedMissedDates, ...filteredNewMissed];
      setMissedDates(updated);
      localStorage.setItem(
        'pushupMissedDates',
        JSON.stringify(updated)
      );
    }

    
  // run once on mount
  // eslint-disable-next-line
  }, []);

  


  const [remaining, setRemaining] = useState(() => {
    if (savedDay && savedDay === todayDay){
      return savedRemaining;
    } else{
      return baseTarget;
    }
  });


useEffect(() => {
  localStorage.setItem('pushupRemaining', remaining);
  localStorage.setItem('pushupLastDay', todayDay);
}, [remaining, todayDay]);

  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const done = parseInt(input);
    if (!isNaN(done)){
      const left = remaining-done;
      if(left < 0){
        setRemaining(0);
      } else {
        setRemaining(prev => Math.min(baseTarget, prev-done))
      }
      setInput('');
    }
  }

  const sortedMissedDates = [...missedDates].sort(
    (a, b) => a.dayOfYear - b.dayOfYear
  );

  const removeMissedDate = (dayOfYear) => {
  const updated = missedDates.filter(d => d.dayOfYear !== dayOfYear);
  setMissedDates(updated);
  localStorage.setItem(
    'pushupMissedDates',
    JSON.stringify(updated)
  );
};


  return (
    <div className='flex flex-col justify-center items-center text-3xl h-full'>
      <h1 className='text-3xl md:text-5xl text-green-500 font-bold mb-16 transform transition duration-200 hover:scale-105 text-center'>Push Up Challenge</h1>
      <p>Push Ups Left Today:</p>
      {remaining ? <p className="text-6xl text-amber-300 font-bold transform transition duration-200 md:hover:scale-110">{remaining}</p> : <p className='text-3xl text-green-400 text-center font-bold transform transition duration-200 md:hover:scale-110'>Congratulations! You have finished your daily pushups!</p>}
      <p className='text-center'>Input number of Push Ups done:</p>
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
        <button type='button' className='cursor-pointer bg-red-400 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105' onClick={() => {
          if (window.confirm("Reset today's progress?")) {
            setRemaining(baseTarget);
          }
        }}>Reset🔄</button>
        <button type='submit' className='cursor-pointer bg-amber-300 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105'>Confirm</button>
        
        </div>
      </form>
        {sortedMissedDates.length > 0 && (
          <div className="mt-8 text-lg text-center">
            <h2 className="text-red-400 font-bold mb-2">Missed Days</h2>
            <ul>
              {sortedMissedDates.map((d) => (
                <li
                  key={d.dayOfYear}
                  className="flex items-center justify-center gap-2"
                >
                  <span>
                    {new Date(d.dateISO).toLocaleDateString()} — {d.remaining}
                  </span>

                  <button
                    className="text-red-400 hover:text-red-600 text-xl font-bold"
                    onClick={() => {
                      if (window.confirm("Remove this missed day?")) {
                        removeMissedDate(d.dayOfYear);
                      }
                    }}
                    aria-label="Remove missed date"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
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
  const todayDay = getDayOfYear(today);
  const baseTarget = getWeekOfYearISO(today);

  const savedDay = Number(localStorage.getItem('pullupLastDay'));
  const savedRemaining =
    Number(localStorage.getItem('pullupRemaining')) || 0;
  const savedMissedDates =
    JSON.parse(localStorage.getItem('pullupMissedDates')) || [];

  const [missedDates, setMissedDates] = useState(savedMissedDates);

  // Detect missed days (run once on mount)
  useEffect(() => {
    if (!savedDay || savedDay >= todayDay) return;

    const newMissed = [];
    const year = today.getFullYear();

    // Yesterday not completed
    if (savedRemaining > 0) {
      const date = dayOfYearToDate(savedDay, year);
      newMissed.push({
        dayOfYear: savedDay,
        dateISO: toLocalISO(date),
        remaining: getWeekOfYearISO(date)
      });
    }

    // Fully missed days
    for (let d = savedDay + 1; d < todayDay; d++) {
      const date = dayOfYearToDate(d, year);
      newMissed.push({
        dayOfYear: d,
        dateISO: toLocalISO(date),
        remaining: getWeekOfYearISO(date)
      });
    }

    const existingDays = new Set(
      savedMissedDates.map(d => d.dayOfYear)
    );

    const filtered = newMissed.filter(
      d => !existingDays.has(d.dayOfYear)
    );

    if (filtered.length > 0) {
      const updated = [...savedMissedDates, ...filtered];
      setMissedDates(updated);
      localStorage.setItem(
        'pullupMissedDates',
        JSON.stringify(updated)
      );
    }
    // eslint-disable-next-line
  }, []);

  const [remaining, setRemaining] = useState(() => {
    if (savedDay && savedDay === todayDay) {
      return savedRemaining;
    }
    return baseTarget;
  });

  useEffect(() => {
    localStorage.setItem('pullupRemaining', remaining);
    localStorage.setItem('pullupLastDay', todayDay);
  }, [remaining, todayDay]);

  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const done = parseInt(input);
    if (!isNaN(done)) {
      setRemaining(prev =>
        Math.max(0, Math.min(baseTarget, prev - done))
      );
      setInput('');
    }
  };

  const sortedMissedDates = [...missedDates].sort(
    (a, b) => a.dayOfYear - b.dayOfYear
  );

  const removeMissedDate = (dayOfYear) => {
  const updated = missedDates.filter(d => d.dayOfYear !== dayOfYear);
  setMissedDates(updated);
  localStorage.setItem(
    'pullupMissedDates',
    JSON.stringify(updated)
  );
};

  return (
    <div className="flex flex-col justify-center items-center text-3xl h-full">
      <h1 className='text-3xl md:text-5xl text-orange-400 font-bold mb-16 transform transition duration-200 hover:scale-105 text-center'>Pull Up Challenge</h1>
      <p>Pull Ups Left Today:</p>
      {remaining ? <p className="text-6xl text-amber-300 font-bold transform transition duration-200 md:hover:scale-110">{remaining}</p> : <p className='text-3xl text-green-400 text-center font-bold transform transition duration-200 md:hover:scale-110'>Congratulations! You have finished your daily pull ups!</p>}
      <p className='text-center'>Input number of Pull Ups done:</p>
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
          <button type="button" className="cursor-pointer bg-red-400 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105" onClick={() => setRemaining(baseTarget)}>Reset🔄</button>
          <button type="submit" className="cursor-pointer bg-amber-300 rounded-md px-2 py-1 text-2xl text-black font-bold transform transition duration-200 hover:scale-105">Confirm</button>
        </div>
      </form>

      {sortedMissedDates.length > 0 && (
        <div className="mt-8 text-lg text-center">
          <h2 className="text-red-400 font-bold mb-2">
            Missed Pull-Up Days
          </h2>
          <ul>
            {sortedMissedDates.map((d) => (
                <li
                  key={d.dayOfYear}
                  className="flex items-center justify-center gap-2"
                >
                  <span>
                    {new Date(d.dateISO).toLocaleDateString()} — {d.remaining}
                  </span>

                  <button
                    className="text-red-400 hover:text-red-600 text-xl font-bold"
                    onClick={() => {
                      if (window.confirm("Remove this missed day?")) {
                        removeMissedDate(d.dayOfYear);
                      }
                    }}
                    aria-label="Remove missed date"
                  >
                    ×
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
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
    <div className='h-screen w-screen flex flex-col overflow-x-hidden'>
      <Navigation setPage={setPage}/>
      <div className='flex-1 flex m-0 items-center justify-center w-full'>
        {page === 1 && <PushUpPage/>}
        {page === 2 && <PullUpPage/>}
        {page === 3 && <AboutPage/>}
      </div>
    </div>
  )
}

export default App
