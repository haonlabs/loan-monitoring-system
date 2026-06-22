import type { LoanStatus as Status } from "@/types";
import { statusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
export function LoanStatus({status,large}:{status:Status;large?:boolean}){return <Badge className={large?"px-4 py-1.5 text-sm":""} variant={status==="paid"?"paid":status==="overdue"?"overdue":"default"}>{statusLabel(status)}</Badge>}
