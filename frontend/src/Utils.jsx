import seedrandom from 'seedrandom';


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

const randomNum = (code, color) => {
    const generator = seedrandom(code+color);
    return (Math.floor(generator() * (235 - 52 + 1) + 52));
}

export const randomRGB = (code) => (
    `rgb(${randomNum(code, "R")}, ${randomNum(code, "G")}, ${randomNum(code, "B")})`
)