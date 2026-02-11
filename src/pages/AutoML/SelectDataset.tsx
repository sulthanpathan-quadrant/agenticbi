// import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Loader2, FileText } from 'lucide-react'
// import Header from '@/components/layout/Header'
// import { useNavigate, useLocation } from 'react-router-dom'

// interface Dataset {
//   filename: string
//   date_modified: string
// }

// interface DatasetResponse {
//   user_id: string
//   job_id: string
//   datasets: Dataset[]
//   count: number
//   folder: string
// }

// const SelectDataset = () => {
//   const [datasets, setDatasets] = useState<Dataset[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [folderPath, setFolderPath] = useState<string>('')

//   const [downloading, setDownloading] = useState(false)
//   const [showPreview, setShowPreview] = useState(false)
//   const [previewData, setPreviewData] = useState<any>(null)

//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [selectedFilename, setSelectedFilename] = useState<string>('')

//   const navigate = useNavigate()
//   const location = useLocation()

//   const mode: 'compare' | 'build' =
//     (location.state as any)?.mode === 'compare' ? 'compare' : 'build'

//   /* ---------------- Fetch datasets ---------------- */
//   useEffect(() => {
//     const fetchDatasets = async () => {
//       try {
//         const userRaw = localStorage.getItem('user')
//         const jobId = localStorage.getItem('current_job_id')

//         if (!userRaw || !jobId) throw new Error('Missing user or job')

//         const user = JSON.parse(userRaw)
//         const userId = user.user_id || user.id

//         const res = await fetch(
//           `https://20.81.213.147/list-datasets?user_id=${userId}&job_id=${jobId}`,
//           { headers: { accept: 'application/json' } }
//         )

//         if (!res.ok) throw new Error('Failed to fetch datasets')

//         const data: DatasetResponse = await res.json()
//         setDatasets(data.datasets || [])
//         setFolderPath(data.folder || '')
//       } catch (e: any) {
//         setError(e.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDatasets()
//   }, [])

//   /* ---------------- Select dataset ---------------- */
//   const handleSelectDataset = async (filename: string) => {
//     try {
//       setDownloading(true)

//       const fullPath = `${folderPath}/${filename}.csv`
//       const url = `https://automl-onelake-webapp-eedahsgvbug3apc6.eastus-01.azurewebsites.net/workspaces/agenticBI/lakehouses/newagenticBI/download-veritas?path=${encodeURIComponent(
//         fullPath
//       )}`

//       const res = await fetch(url)
//       if (!res.ok) throw new Error('Download failed')

//       const blob = await res.blob()
//       const file = new File([blob], `${filename}.csv`, { type: 'text/csv' })

//       setSelectedFile(file)
//       setSelectedFilename(`${filename}.csv`)
//       await fetchPreviewData(filename)
//     } catch (e: any) {
//       setError(e.message)
//     } finally {
//       setDownloading(false)
//     }
//   }

//   /* ---------------- Preview ---------------- */
//   const fetchPreviewData = async (datasetName: string) => {
//     const userRaw = localStorage.getItem('user')
//     const jobId = localStorage.getItem('current_job_id')

//     if (!userRaw || !jobId) return

//     const user = JSON.parse(userRaw)
//     const userId = user.user_id || user.id

//     const res = await fetch(
//       `https://20.81.213.147/preview-dataset?user_id=${userId}&job_id=${jobId}&datasetname=${datasetName}`,
//       { headers: { accept: 'application/json' } }
//     )

//     const data = await res.json()
//     setPreviewData({
//       columns: data.columns,
//       rows: data.preview_rows,
//       total_rows: data.total_rows,
//       preview_rows: data.preview_row_count
//     })
//     setShowPreview(true)
//   }

//   const handleContinue = () => {
//     navigate(
//       mode === 'compare'
//         ? '/workflow/automl/compare'
//         : '/workflow/automl/build-model',
//       {
//         state: {
//           dataset: {
//             file: selectedFile,
//             name: selectedFilename
//           }
//         }
//       }
//     )
//   }

//   /* ================= PREVIEW ================= */
//   if (showPreview && previewData) {
//     return (
//       <div className="min-h-screen bg-muted/30">
//         <Header />
//         <main className="pt-20 px-6 pb-12 max-w-6xl mx-auto">
//           <div className="flex justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-semibold">Dataset Preview</h1>
//               <p className="text-muted-foreground text-sm">{selectedFilename}</p>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => setShowPreview(false)}>
//                 Back
//               </Button>
//               <Button onClick={handleContinue}>
//                 Continue
//               </Button>
//             </div>
//           </div>

//           <div className="rounded-lg border bg-card overflow-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-muted">
//                 <tr>
//                   {previewData.columns.map((c: string) => (
//                     <th key={c} className="px-3 py-2 text-left font-medium">
//                       {c}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {previewData.rows.map((row: any, i: number) => (
//                   <tr key={i} className="border-t">
//                     {previewData.columns.map((c: string) => (
//                       <td key={c} className="px-3 py-2">
//                         {row[c]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     )
//   }

//   /* ================= LIST ================= */
//   return (
//     <div className="min-h-screen bg-muted/30">
//       <Header />
//       <main className="pt-20 px-6 pb-12 max-w-3xl mx-auto">
//         <h1 className="text-2xl font-semibold mb-1">Select Dataset</h1>
//         <p className="text-sm text-muted-foreground mb-6">
//           Choose a dataset to {mode === 'compare' ? 'compare models' : 'build model'}
//         </p>

//         {loading && (
//           <div className="flex items-center gap-2 text-muted-foreground text-sm">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             Loading datasets…
//           </div>
//         )}

//         {error && (
//           <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
//             {error}
//           </div>
//         )}

//         {!loading && !error && (
//           <div className="space-y-2">
//             {datasets.map(ds => (
//               <div
//                 key={ds.filename}
//                 className="flex items-center justify-between px-4 py-2
//                            rounded-md border bg-background
//                            hover:bg-muted/40 transition"
//               >
//                 <div className="flex items-center gap-2 text-sm">
//                   <FileText className="w-4 h-4 text-primary" />
//                   <span>{ds.filename}</span>
//                 </div>

//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   disabled={downloading}
//                   onClick={() => handleSelectDataset(ds.filename)}
//                 >
//                   Select
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// export default SelectDataset

// import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Loader2, FileText } from 'lucide-react'
// import Header from '@/components/layout/Header'
// import { useNavigate, useLocation } from 'react-router-dom'

// interface Dataset {
//   filename: string
//   date_modified: string
// }

// interface DatasetResponse {
//   user_id: string
//   job_id: string
//   datasets: Dataset[]
//   count: number
//   folder: string
// }

// const SelectDataset = () => {
//   const [datasets, setDatasets] = useState<Dataset[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [folderPath, setFolderPath] = useState<string>('')

//   const [downloading, setDownloading] = useState(false)
//   const [previewData, setPreviewData] = useState<any>(null)
//   const [selectedFilename, setSelectedFilename] = useState<string | null>(null)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)

//   const navigate = useNavigate()
//   const location = useLocation()

//   const mode: 'compare' | 'build' =
//     (location.state as any)?.mode === 'compare' ? 'compare' : 'build'

//   /* ---------------- Fetch datasets ---------------- */
//   useEffect(() => {
//     const fetchDatasets = async () => {
//       try {
//         const userRaw = localStorage.getItem('user')
//         const jobId = localStorage.getItem('current_job_id')
//         if (!userRaw || !jobId) throw new Error('Missing user or job')

//         const user = JSON.parse(userRaw)
//         const userId = user.user_id || user.id

//         const res = await fetch(
//           `https://20.81.213.147/list-datasets?user_id=${userId}&job_id=${jobId}`,
//           { headers: { accept: 'application/json' } }
//         )

//         if (!res.ok) throw new Error('Failed to fetch datasets')

//         const data: DatasetResponse = await res.json()
//         setDatasets(data.datasets || [])
//         setFolderPath(data.folder || '')
//       } catch (e: any) {
//         setError(e.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDatasets()
//   }, [])

//   /* ---------------- Select dataset ---------------- */
//   const handleSelectDataset = async (filename: string) => {
//     try {
//       setDownloading(true)
//       setError(null)
//       setSelectedFilename(filename)

//       const fullPath = `${folderPath}/${filename}.csv`
//       const downloadUrl = `https://automl-onelake-webapp-eedahsgvbug3apc6.eastus-01.azurewebsites.net/workspaces/agenticBI/lakehouses/newagenticBI/download-veritas?path=${encodeURIComponent(
//         fullPath
//       )}`

//       const res = await fetch(downloadUrl)
//       if (!res.ok) throw new Error('Download failed')

//       const blob = await res.blob()
//       const file = new File([blob], `${filename}.csv`, { type: 'text/csv' })
//       setSelectedFile(file)

//       // fetch preview
//       const userRaw = localStorage.getItem('user')
//       const jobId = localStorage.getItem('current_job_id')
//       const user = JSON.parse(userRaw!)
//       const userId = user.user_id || user.id

//       const previewRes = await fetch(
//         `https://20.81.213.147/preview-dataset?user_id=${userId}&job_id=${jobId}&datasetname=${filename}`,
//         { headers: { accept: 'application/json' } }
//       )

//       const preview = await previewRes.json()
//       setPreviewData({
//         columns: preview.columns,
//         rows: preview.preview_rows,
//         total_rows: preview.total_rows,
//         preview_rows: preview.preview_row_count
//       })
//     } catch (e: any) {
//       setError(e.message)
//     } finally {
//       setDownloading(false)
//     }
//   }

//   const handleContinue = () => {
//     navigate(
//       mode === 'compare'
//         ? '/workflow/automl/compare'
//         : '/workflow/automl/build-model',
//       {
//         state: {
//           dataset: {
//             file: selectedFile,
//             name: `${selectedFilename}.csv`
//           }
//         }
//       }
//     )
//   }

//   return (
//     <div className="min-h-screen bg-muted/30">
//       <Header />

//       <main className="pt-20 px-6 pb-12 max-w-5xl">
//         <h1 className="text-3xl font-semibold mb-2">Select Dataset</h1>
//         <p className="text-muted-foreground text-base mb-6">
//           Choose a dataset to continue with{' '}
//           <span className="font-medium">
//             {mode === 'compare' ? 'model comparison' : 'model building'}
//           </span>
//         </p>

//         {loading && (
//           <div className="flex items-center gap-2 text-muted-foreground">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             Loading datasets…
//           </div>
//         )}

//         {error && (
//           <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
//             {error}
//           </div>
//         )}

//         {/* Dataset list */}
//         <div className="space-y-3">
//           {datasets.map(ds => {
//             const isSelected = selectedFilename === ds.filename

//             return (
//               <div key={ds.filename}>
//                 {/* Row */}
//                 <div
//                   className={`flex items-center gap-3 px-4 py-3 rounded-lg border
//                     ${isSelected ? 'border-primary bg-primary/5' : 'bg-background'}
//                   `}
//                 >
//                   <FileText className="w-5 h-5 text-primary shrink-0" />

//                   <div className="flex-1 text-base font-medium">
//                     {ds.filename}
//                   </div>

//                   <Button
//                     size="sm"
//                     variant={isSelected ? 'default' : 'outline'}
//                     disabled={downloading}
//                     onClick={() => handleSelectDataset(ds.filename)}
//                   >
//                     {downloading && isSelected ? 'Loading…' : 'Select'}
//                   </Button>
//                 </div>

//                 {/* Inline preview */}
//                 {isSelected && previewData && (
//                   <div className="ml-10 mt-3 mb-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="text-sm text-muted-foreground">
//                         Preview ({previewData.preview_rows} rows)
//                       </p>
//                       <Button size="sm" onClick={handleContinue}>
//                         Continue
//                       </Button>
//                     </div>

//                     <div className="border rounded-md overflow-auto bg-card">
//                       <table className="w-full text-sm">
//                         <thead className="bg-muted">
//                           <tr>
//                             {previewData.columns.map((c: string) => (
//                               <th
//                                 key={c}
//                                 className="px-3 py-2 text-left font-medium"
//                               >
//                                 {c}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {previewData.rows.map((row: any, i: number) => (
//                             <tr key={i} className="border-t">
//                               {previewData.columns.map((c: string) => (
//                                 <td key={c} className="px-3 py-2">
//                                   {row[c]}
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </main>
//     </div>
//   )
// }

// export default SelectDataset

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, FileText, ChevronRight, ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'

interface Dataset {
  filename: string
  date_modified: string
}

interface DatasetResponse {
  user_id: string
  job_id: string
  datasets: Dataset[]
  count: number
  folder: string
}

const SelectDataset = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<string>('')

  const [downloading, setDownloading] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const mode: 'compare' | 'build' =
    (location.state as any)?.mode === 'compare' ? 'compare' : 'build'

  /* ---------------- Fetch datasets ---------------- */
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const userRaw = localStorage.getItem('user')
        const jobId = localStorage.getItem('current_job_id')
        if (!userRaw || !jobId) throw new Error('Missing user or job')

        const user = JSON.parse(userRaw)
        const userId = user.user_id || user.id

        const res = await fetch(
          `https://api.veriton.ai/api/service2/list-datasets?user_id=${userId}&job_id=${jobId}`,
          { headers: { accept: 'application/json' } }
        )

        if (!res.ok) throw new Error('Failed to fetch datasets')

        const data: DatasetResponse = await res.json()
        setDatasets(data.datasets || [])
        setFolderPath(data.folder || '')
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  /* ---------------- Select dataset ---------------- */
  const handleSelectDataset = async (filename: string) => {
    try {
      setDownloading(true)
      setError(null)
      setSelectedFilename(filename)

      const fullPath = `${folderPath}/${filename}.csv`
      const downloadUrl = `https://automl-onelake-webapp-eedahsgvbug3apc6.eastus-01.azurewebsites.net/workspaces/agenticBI/lakehouses/newagenticBI/download-veritas?path=${encodeURIComponent(
        fullPath
      )}`

      const res = await fetch(downloadUrl)
      if (!res.ok) throw new Error('Download failed')

      const blob = await res.blob()
      const file = new File([blob], `${filename}.csv`, { type: 'text/csv' })
      setSelectedFile(file)

      const userRaw = localStorage.getItem('user')
      const jobId = localStorage.getItem('current_job_id')
      const user = JSON.parse(userRaw!)
      const userId = user.user_id || user.id

      const previewRes = await fetch(
        `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${jobId}&datasetname=${filename}`,
        { headers: { accept: 'application/json' } }
      )

      const preview = await previewRes.json()
      setPreviewData({
        columns: preview.columns,
        rows: preview.preview_rows,
        total_rows: preview.total_rows,
        preview_rows: preview.preview_row_count
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setDownloading(false)
    }
  }

  const handleContinue = () => {
    navigate(
      mode === 'compare'
        ? '/workflow/automl/compare'
        : '/workflow/automl/build-model',
      {
        state: {
          dataset: {
            file: selectedFile,
            name: `${selectedFilename}.csv`
          }
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ✅ Static Header */}
      <Header />

      {/* Page content (offset for fixed header) */}
      <main className="pt-20 px-10 pb-16 max-w-[1400px]">
        {/* Back */}
        <button
          onClick={() => navigate('/workflow/automl')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-foreground mb-1">
          Select Dataset
        </h1>
        <p className="text-muted-foreground text-base mb-8">
          Choose a dataset to continue with{' '}
          <span className="font-medium text-foreground">
            {mode === 'compare' ? 'model comparison' : 'model building'}
          </span>
        </p>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading datasets…
          </div>
        )}

        {error && (
          <div className="mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Dataset list (LEFT) */}
        <div className="max-w-xl space-y-2">
          {datasets.map(ds => {
            const isSelected = selectedFilename === ds.filename

            return (
              <button
                key={ds.filename}
                onClick={() => handleSelectDataset(ds.filename)}
                disabled={downloading}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left
                  ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:bg-muted/40'
                  }
                `}
              >
                <FileText
                  className={`w-4 h-4 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />

                <span className="text-base font-medium truncate">
                  {ds.filename}
                </span>

                <div className="ml-auto flex items-center gap-2">
                  {downloading && isSelected && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            )
          })}
        </div>

        {/* ✅ Full-width preview (NO SCROLLBAR) */}
        {previewData && (
          <div className="mt-12 w-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Dataset Preview
                </h2>
                <p className="text-muted-foreground text-sm">
                  Showing {previewData.preview_rows} of {previewData.total_rows}{' '}
                  rows
                </p>
              </div>

              <Button onClick={handleContinue}>
                Continue
              </Button>
            </div>

            <div className="border border-border rounded-xl bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {previewData.columns.map((c: string) => (
                      <th
                        key={c}
                        className="px-4 py-3 text-left font-semibold text-foreground border-b border-border"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {previewData.rows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/30">
                      {previewData.columns.map((c: string) => (
                        <td key={c} className="px-4 py-3">
                          {row[c] ?? '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SelectDataset

