
class jewTime{
    //defines an amount of time with halachic units
    //includes methods for mathematical operations on times
    constructor(days=0,hours=0,parts=0,moments=0){
        this.days=days;
        this.hours=hours;
        this.parts=parts;
        this.moments=moments;

    }



}
function simplify(time){
    var parts=time["parts"];
    var hours=time["hours"];
    var days=time["days"];
    while(parts >= 1080){
        hours+=1;
        parts-=1080;
    }
    while(hours >= 24){
        days+=1;
        hours-=24;
    }


    while(parts < 0){
        hours-=1;
        parts+=1080;
    }
    while(hours < 0){
        days-=1;
        hours+=24;
    }
    return {"days":days,"hours":hours,"parts":parts};
}
function multiply(time,multiplier){
    var parts=time["parts"];
    var hours=time["hours"];
    var days=time["days"];
    parts *=multiplier;
    hours *= multiplier;
    days *= multiplier;
    return simplify({"days":days,"hours":hours,"parts":parts});

}
function add(times){
    var parts=0;
    var hours=0;
    var days=0;
    for(let time in times){
        parts += times[time]["parts"];
        hours += times[time]["hours"];
        days += times[time]["days"];
    }
    return simplify({"days":days,"hours":hours,"parts":parts});
}
function subtract(time1,time2){
    parts=time1["parts"]
    hours=time1["hours"]
    days= time1["days"]
    parts-= time2["parts"];
    hours-= time2["hours"];
    days-= time2["days"];
    return simplify({"days":days,"hours":hours,"parts":parts});
}
function compare(time1,time2){
    //describes time1 as compared to time2
    //responses can be "greater", "less", or "equals"

    difference=subtract(time1,time2)
    days=difference["days"];
    hours=difference["hours"];
    parts=difference["parts"];

    if (days==0 && hours==0 && parts==0){
        return "equals";
    }
    if(days<0){
        return "less";
    }
    if(days>0 || hours>0 || parts > 0){
        return "greater";
    }
    


}

function calendar(year){
    //define standard times
    const startMolad={"days":1,"hours":23,"parts":204};
    const yearLength={"days":354,"hours":8,"parts":876};
    const leapYearLength={"days":383,"hours":21,"parts":589};
    const cycleLength={"days":6939,"hours":16,"parts":595};
    const monthLength={"days":29,"hours":12,"parts":793};
    const leapYears={1:3,2:6,3:11,4:14,5:17,6:19}

    var elapsed=year-1;
    var yearInCycle=elapsedYears+1;
    var elapsedCycle=Math.trunc(elapsed/19);
    var elapsedYears=elapsed-elapsedCycle*19;
    var elapsedLeap=0;
    for (var x in leapYears) {
        if(leapYears[x]<=elapsedYears){

            elapsedLeap+=1;
        }
      }
    var elapsedSimple=elapsedYears-elapsedLeap;

    var addCycle=multiply(cycleLength,elapsedCycle);
    var addSimple=multiply(yearLength,elapsedSimple);
    var addLeap=multiply(leapYearLength,elapsedLeap);
    var result=add({1:startMolad,2:addCycle,3:addSimple,4:addLeap});

    console.log(elapsedSimple);
    console.log(elapsedLeap);
    result["days"]%=7;

    

    return result;

}


    

console.log(calendar(5783));


//represents a moment in time in the jewish calendar with relevant information and methods
class jewDate{
    constructor(date){
        this.dateObj=date;
        this.absolute=this.aboluteFromCivil(this.dateObj);
        this.jewishFromAbsolute(this.absolute);

    }


    aboluteFromCivil(date){
        var currentYear = date.getFullYear();
        var currentMonth = date.getMonth();
        var day = date.getDate();

        var absoluteDays = day - 1;

        // Calculate days in elapsed years, considering leap years
        for (var year = 1; year < currentYear; year++) {
            if (this.isCivilLeap(year)) {
                absoluteDays += 366;
            } else {
                absoluteDays += 365;
            }
        }

        let monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust February length for the current year if it's a leap year
        if (this.isCivilLeap(currentYear)) {
            monthLengths[1] = 29;
        }

        // Calculate days in elapsed months
        for (var month = 0; month < currentMonth; month++) {
            absoluteDays += monthLengths[month];
        }
        return absoluteDays+1721425;// offset to Rata Die date (Gregorian start date (November 24, 4714 BCE))
    }

    isCivilLeap(year) {
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                if (year % 400 == 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    jewishFromAbsolute(absolute){
        const startMolad={"days":1,"hours":23,"parts":204};
        const yearLength={"days":354,"hours":8,"parts":876};
        const leapYearLength={"days":383,"hours":21,"parts":589};
        const cycleLength={"days":6939,"hours":16,"parts":595};
        const monthLength={"days":29,"hours":12,"parts":793};
        const leapYears={1:3,2:6,3:11,4:14,5:17,6:19}

        var elapsedCycles=0;
        var elapsedLeap=0;
        var elaspedRegular=0;
        
        //still needs adjustment!!
        absolute-=348338; //offset Rata Die to Molad Rishon days
        console.log(absolute);


        var time={"days":absolute,"hours":0,"parts":0};
        while (compare(time,cycleLength)=="greater"){     
            time=subtract(time,cycleLength);

            elapsedCycles+=1;
        }

        for(let year = 1; year < 20; year++) {
            if(year in leapYears){ //how do you actually do this??
                if (compare(time,leapYearLength)=="greater"){
                    time=subtract(time,leapYearLength);
                    elapsedLeap+=1;
                    console.log("leap!");
                }

            }else{
                if (compare(time,yearLength)=="greater"){
                    time=subtract(time,leapYearLength);
                    elaspedRegular+=1;
                    console.log("year!");
                }

            }
        }
        console.log(elapsedCycles);
        this.year=1+elaspedRegular+elapsedLeap+(19*elapsedCycles);
        console.log(time);

        //must make rosh hashona calculation to get exact month and day


    }
    
}


today=new Date();
pizza=new jewDate(today);
