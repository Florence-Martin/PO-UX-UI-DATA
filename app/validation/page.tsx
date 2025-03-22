import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ValidationChecklists } from "@/components/validation/validation-checklists"
import { ApiTesting } from "@/components/validation/api-testing"
import { ExternalTools } from "@/components/validation/external-tools"

export default function ValidationPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Validation & Suivi Qualité</h2>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Checklists de Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationChecklists />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tests API</CardTitle>
            </CardHeader>
            <CardContent>
              <ApiTesting />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outils Externes</CardTitle>
            </CardHeader>
            <CardContent>
              <ExternalTools />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}