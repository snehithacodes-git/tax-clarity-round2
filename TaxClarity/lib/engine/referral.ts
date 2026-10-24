export function shouldRefer(question:string){
  const q=question.toLowerCase();
  if(q.includes("best way to reduce tax") || q.includes("how to save tax") || q.includes("evade")){
    return {fired:true, triggerId:"ADVICE_BOUNDARY", whatIsWrong:"Request for personalized tax avoidance advice", whyItMatters:"Providing tax advice requires professional qualification and current law verification", nextAction:"Stop tool, explain boundary, recommend official portal or licensed professional", recommend:"Income Tax Dept portal / Tax Professional"};
  }
  if(q.includes("freelance") && q.includes("no invoice")){
    return {fired:true, triggerId:"PROFESSIONAL_REVIEW", whatIsWrong:"Freelance income without invoices", whyItMatters:"May need ITR-3/4 and audit applicability check", nextAction:"Refer to professional review", recommend:"Professional Review"};
  }
  if(q.includes("mismatch") && q.includes("20%")){
    return {fired:true, triggerId:"OFFICIAL_VERIFICATION", whatIsWrong:"Large mismatch >20% with conflicting sources", whyItMatters:"Risk of defective return notice", nextAction:"Recommend official AIS feedback + employer correction", recommend:"Official verification"};
  }
  return {fired:false} as any;
}
