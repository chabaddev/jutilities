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
    result["days"]%=7;
    return result;

}
console.log(calendar(5783));