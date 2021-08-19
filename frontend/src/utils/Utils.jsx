import seedrandom from 'seedrandom';

// Function to build list of years as options. 
export function generateYearList({
    startYear,
    endYear
}){
    let yearList = []
    for (let i = 0; i <= endYear-startYear; i++) {
        yearList.push({
            key: i,
            year: startYear+i
        })
    }
    return yearList
}

const randomNum = (code, start, end) => {
    const generator = seedrandom(code);
    return (Math.floor(generator() * (start - end) + start));
}

// Util fn to generate random color across all hues, but limited saturation and brightness. 
export const randomRGB = (code) => (
    `hsl(${randomNum(code, 0, 360)}, ${randomNum(code, 90, 100)}%, ${randomNum(code, 40, 60)}%)`
)