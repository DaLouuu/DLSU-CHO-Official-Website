import { SelectItem } from "@/components/ui/select"

export function ExcuseReasonOptions() {
  return (
    <>
      <SelectItem value="sickness">Sickness</SelectItem>
      <SelectItem value="family-matters">Family Matters</SelectItem>
      <SelectItem value="exam">Exam on Same Day</SelectItem>
      <SelectItem value="thesis">Thesis Meeting</SelectItem>
      <SelectItem value="requirements">Requirements on Same Day</SelectItem>
      <SelectItem value="others">Others</SelectItem>
    </>
  )
}
