export interface Document { id:string; versionId:string; issueDate:string; taxPeriod:string; sourceEntity:string; uploadTime:string; supersedesId:string|null; lineItems:{desc:string,amount:number}[]; statedTotal:number; freshness:string; isSuperseded?:boolean; }
export function computeSum(doc:Document){ return doc.lineItems.reduce((s,l)=>s+l.amount,0); }
export function validateInternal(doc:Document){ const sum=computeSum(doc); return { valid: sum===doc.statedTotal, sum, stated: doc.statedTotal, delta: doc.statedTotal-sum }; }
