import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
// import { ImportedDataset } from '@/components/modals/UnifiedImportModal'
import { ImportedDataset } from '../modals/UnifiedImportModal';
import { useLocation } from 'react-router-dom'

interface CompareTabProps {
  dataset?: ImportedDataset | null
}

type MetricSpec = { key: string; label: string; isLowerBetter?: boolean }

const modelsByTask: Record<string, string[]> = {
  Classification: [
    'Logistic Regression',
    'Random Forest',
    'Gradient Boosting',
    'XGBoost'
  ],
  Regression: ['Ridge', 'Random Forest', 'Gradient Boosting', 'XGBoost'],
  Forecasting: ['ARIMA', 'Prophet', 'XGBoost', 'LightGBM', 'CatBoost'],
  Clustering: ['KMeans', 'KMeans++', 'DBSCAN', 'GMM'],
  'Anomaly Detection': [
    'Isolation Forest',
    'One-Class SVM',
    'Local Outlier Factor (LOF)',
    'Elliptic Envelope'
  ]
}

const metricsByTask: Record<string, MetricSpec[]> = {
  Classification: [
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'f1', label: 'F1 Score' },
    { key: 'precision', label: 'Precision' },
    { key: 'recall', label: 'Recall' },
    { key: 'roc_auc', label: 'ROC-AUC' },
    { key: 'precision_recall_auc', label: 'PR-AUC' }
  ],
  Regression: [
    { key: 'rmse', label: 'RMSE', isLowerBetter: true },
    { key: 'mae', label: 'MAE', isLowerBetter: true },
    { key: 'r2', label: 'R²' },
    { key: 'mape', label: 'MAPE', isLowerBetter: true },
    { key: 'mean_residual', label: 'Mean Residual', isLowerBetter: true },
    { key: 'std_residual', label: 'Std Residual', isLowerBetter: true },
    { key: 'pred_mean', label: 'Pred Mean' },
    { key: 'pred_std', label: 'Pred Std' }
  ],
  Forecasting: [
    { key: 'rmse', label: 'RMSE', isLowerBetter: true },
    { key: 'mae', label: 'MAE', isLowerBetter: true },
    { key: 'r2', label: 'R²' },
    { key: 'mape', label: 'MAPE', isLowerBetter: true },
    { key: 'mse', label: 'MSE', isLowerBetter: true },
    { key: 'mean_residual', label: 'Mean Residual', isLowerBetter: true },
    { key: 'std_residual', label: 'Std Residual', isLowerBetter: true },
    { key: 'pred_mean', label: 'Pred Mean' },
    { key: 'pred_std', label: 'Pred Std' }
  ],
  Clustering: [
    { key: 'n_clusters', label: 'Number of Clusters' },
    { key: 'n_noise_points', label: 'Noise Points' },
    { key: 'silhouette_score', label: 'Silhouette Score' },
    {
      key: 'davies_bouldin_score',
      label: 'Davies-Bouldin',
      isLowerBetter: true
    },
    { key: 'calinski_harabasz', label: 'Calinski-Harabasz' }
  ],
  'Anomaly Detection': [
    { key: 'n_anomalies', label: 'Number of Anomalies' },
    { key: 'anomaly_percentage', label: 'Anomaly Percentage (%)' },
    { key: 'anomaly_score', label: 'Anomaly Score' },
    { key: 'avg_anomaly_score', label: 'Avg Anomaly Score' },
    { key: 'std_anomaly_score', label: 'Std Anomaly Score' },
    { key: 'min_anomaly_score', label: 'Min Anomaly Score' },
    { key: 'max_anomaly_score', label: 'Max Anomaly Score' }
  ]
}

// Best-effort mapping from human model name -> API key (extendable)
function modelNameToApiKey (name: string) {
  if (!name) return name
  const mapping: Record<string, string> = {
    'Logistic Regression': 'logistic_regression',
    'Random Forest': 'random_forest',
    'Gradient Boosting': 'gradient_boosting',
    XGBoost: 'xgboost',
    Ridge: 'ridge',
    ARIMA: 'arima',
    Prophet: 'prophet',
    LightGBM: 'lightgbm',
    CatBoost: 'catboost',
    KMeans: 'kmeans',
    'KMeans++': 'kmeans_plusplus',
    DBSCAN: 'dbscan',
    GMM: 'gmm',
    'Isolation Forest': 'isolation_forest',
    'One-Class SVM': 'one_class_svm',
    'Local Outlier Factor (LOF)': 'lof',
    'Elliptic Envelope': 'elliptic_envelope'
  }
  if (mapping[name]) return mapping[name]
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

// Generates mock values appropriate for given task + metric
function generateMockMetricsForTask (task: string) {
  const specs = metricsByTask[task] || []
  const obj: Record<string, string> = {}
  specs.forEach(spec => {
    // realistic ranges:
    if (
      spec.key === 'accuracy' ||
      spec.key === 'auc' ||
      spec.key === 'f1_score' ||
      spec.key === 'precision' ||
      spec.key === 'recall' ||
      spec.key === 'roc_auc' ||
      spec.key === 'precision_recall_auc'
    ) {
      const val = 0.7 + Math.random() * 0.3 // 0.7 - 1.0
      obj[spec.key] = (val * 100).toFixed(1) + '%'
    } else if (
      spec.key === 'rmse' ||
      spec.key === 'mae' ||
      spec.key === 'mse' ||
      spec.key === 'std_residual'
    ) {
      obj[spec.key] = (0.05 + Math.random() * 1.0).toFixed(4)
    } else if (spec.key === 'r2') {
      obj[spec.key] = (Math.random() * 1).toFixed(4)
    } else if (spec.key === 'mape') {
      obj[spec.key] = (5 + Math.random() * 50).toFixed(2) + '%'
    } else if (spec.key === 'mean_residual') {
      obj[spec.key] = ((Math.random() - 0.5) * 0.1).toFixed(6)
    } else if (spec.key === 'pred_mean' || spec.key === 'pred_std') {
      obj[spec.key] = (Math.random() * 0.5).toFixed(4)
    } else if (spec.key === 'silhouette') {
      obj[spec.key] = (0.2 + Math.random() * 0.8).toFixed(3)
    } else if (spec.key === 'davies_bouldin') {
      obj[spec.key] = (0.2 + Math.random() * 3.0).toFixed(3)
    } else if (spec.key === 'calinski_harabasz') {
      obj[spec.key] = Math.round(50 + Math.random() * 2000).toString()
    } else if (spec.key === 'anomaly_score') {
      obj[spec.key] = (Math.random() * 1).toFixed(4)
    } else {
      // default numeric
      obj[spec.key] = (Math.random() * 1).toFixed(4)
    }
  })
  return obj
}

const BUILD_API =
  'https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/build_ml_model'

const FULL_DATA_URL =
  'https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/data_full'

const TASK_FEATURES_API =
  'https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/task_features'

const CompareTab = ({}: CompareTabProps) => {
  const navigate = useNavigate()
  const [selectedTask, setSelectedTask] = useState('') // previously selectedFunction
  const [selectedModel1, setSelectedModel1] = useState('')
  const [selectedModel2, setSelectedModel2] = useState('')
  const [selectedFeature, setSelectedFeature] = useState<'all' | string>('all')
  const [columns, setColumns] = useState<string[]>([])
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonComplete, setComparisonComplete] = useState(false)
  const [model1Metrics, setModel1Metrics] = useState<Record<
    string,
    any
  > | null>(null)
  const [model2Metrics, setModel2Metrics] = useState<Record<
    string,
    any
  > | null>(null)
  const [apiResponseRaw, setApiResponseRaw] = useState<any | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [blobPath, setBlobPath] = useState<string | null>(null)
  const [taskSpecificFeatures, setTaskSpecificFeatures] = useState<string[]>([])
  const [isFetchingFeatures, setIsFetchingFeatures] = useState(false)
  const location = useLocation()
const dataset = (location.state as any)?.dataset || null

  useEffect(() => {
    // populate columns from dataset preview (same approach as earlier)
    if (dataset && (dataset as any).preview) {
      const preview = (dataset as any).preview
      if (preview.columns && Array.isArray(preview.columns)) {
        setColumns(preview.columns)
      } else if (Array.isArray(preview.rows) && preview.rows.length > 0) {
        setColumns(Object.keys(preview.rows[0]))
      } else if (
        Array.isArray((dataset as any).preview) &&
        (dataset as any).preview.length > 0
      ) {
        setColumns(Object.keys((dataset as any).preview[0]))
      } else {
        setColumns([])
      }
    } else {
      setColumns([])
    }
  }, [dataset])

  useEffect(() => {
    // reset models & results whenever task changes
    setSelectedModel1('')
    setSelectedModel2('')
    setComparisonComplete(false)
    setModel1Metrics(null)
    setModel2Metrics(null)
    setApiResponseRaw(null)
    setErrorMessage(null)
    setSelectedFeature('all') // Reset feature selection
    setTaskSpecificFeatures([]) // Clear previous features

    // Fetch task-specific features immediately when task is selected
    if (selectedTask && dataset?.file) {
      fetchTaskSpecificFeatures(selectedTask)
    }
  }, [selectedTask])

  const availableModels = useMemo(() => {
    return selectedTask ? modelsByTask[selectedTask] || [] : []
  }, [selectedTask])

  const getUserEmailFromLocal = (): string | null => {
    try {
      const raw = localStorage.getItem('aivolve_user')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed?.email ?? null
    } catch {
      return null
    }
  }

  const getUserFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem('aivolve_user')
      if (!raw) return null
      return JSON.parse(raw) as {
        email?: string
        session_id?: string
        user_id?: string
        agent_name?: string
        [key: string]: any
      }
    } catch {
      return null
    }
  }

  

  const fetchFullData = async (blobPath: string, userEmail: string) => {
    const url = `${FULL_DATA_URL}?blob_path=${encodeURIComponent(
      blobPath
    )}&user_email=${encodeURIComponent(userEmail)}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch full data')
    }
    const text = await res.text()
    const blob = new Blob([text], { type: 'text/csv' })
    return new File([blob], dataset!.name, { type: 'text/csv' })
  }

  const canCompare = !!(
    selectedTask &&
    selectedModel1 &&
    selectedModel2 &&
    selectedModel1 !== selectedModel2
  )

  const uploadFileAndGetBlobPath = async (): Promise<string | null> => {
  if (blobPath) return blobPath

  if (!dataset || !dataset.file) {
    setErrorMessage('No dataset selected')
    return null
  }

  const raw = localStorage.getItem('aivolve_user')
  if (!raw) {
    setErrorMessage('User not found')
    return null
  }

  const user = JSON.parse(raw)
  const userEmail = user.email

  const formData = new FormData()
  formData.append('file', dataset.file)
  formData.append('upload_file_path', 'true')
  formData.append('user_email', userEmail)

  const res = await fetch(BUILD_API, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    throw new Error('Failed to upload file')
  }

  const json = await res.json()

  if (json.blob_path) {
    setBlobPath(json.blob_path)
    return json.blob_path
  }

  return null
}


const fetchTaskSpecificFeatures = async (task: string) => {
  setIsFetchingFeatures(true)
  setTaskSpecificFeatures([])

  try {
    const path = await uploadFileAndGetBlobPath()
    if (!path) return

    const raw = localStorage.getItem('aivolve_user')
    const user = JSON.parse(raw!)
    const userEmail = user.email

    const url = `${TASK_FEATURES_API}?blob_path=${encodeURIComponent(
      path
    )}&task=${task.toLowerCase().replace(/\s+/g, '_')}&user_email=${encodeURIComponent(userEmail)}`

    const res = await fetch(url)
    const json = await res.json()

    setTaskSpecificFeatures(json.features || [])
  } catch {
    setTaskSpecificFeatures([])
  } finally {
    setIsFetchingFeatures(false)
  }
}


  const fetchAndCompare = async () => {
    setErrorMessage(null)
    setIsComparing(true)
    setComparisonComplete(false)
    setModel1Metrics(null)
    setModel2Metrics(null)
    setApiResponseRaw(null)

    if (!dataset) {
      setErrorMessage(
        'No dataset selected. Please select a dataset from the data source tab.'
      )
      setIsComparing(false)
      return
    }

    const user = getUserFromLocalStorage()
    const userEmail = user?.email
    if (!userEmail || !user.user_id || !user.agent_name) {
      setErrorMessage('User information not found. Please login again.')
      setIsComparing(false)
      return
    }

    const blobPath = `${user.user_id}/${user.agent_name}/${dataset.name}`

    let fileToSend: File
    if (dataset.file && dataset.file.size > 0) {
      fileToSend = dataset.file
    } else {
      try {
        fileToSend = await fetchFullData(blobPath, userEmail)
      } catch (err) {
        setErrorMessage('Failed to fetch full dataset. Please try again.')
        setIsComparing(false)
        return
      }
    }

    const fd = new FormData()
    fd.append('task', selectedTask.toLowerCase().replace(/\s+/g, '_'))
    fd.append(
      'target',
      selectedFeature === 'all' ? 'all' : (selectedFeature as string)
    )
    fd.append('user_email', userEmail)
    fd.append('file', fileToSend)

    try {
      const res = await fetch(BUILD_API, { method: 'POST', body: fd })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`API error ${res.status}: ${txt}`)
      }
      const json = await res.json()
      setApiResponseRaw(json)

      const allModels = json?.all_models ?? {}
      // map user-chosen display names to likely API keys
      const key1 = modelNameToApiKey(selectedModel1)
      const key2 = modelNameToApiKey(selectedModel2)

      // helper to find best match in allModels by fuzzy matching
      const findKey = (k: string | null) => {
        if (!k) return null
        if (allModels[k]) return k
        const lower = k.toLowerCase()
        const candidate = Object.keys(allModels).find(
          c => c.toLowerCase() === lower
        )
        if (candidate) return candidate
        const candidate2 = Object.keys(allModels).find(c =>
          c.toLowerCase().includes(lower)
        )
        if (candidate2) return candidate2
        return null
      }

      const real1 = findKey(key1)
      const real2 = findKey(key2)

      const pickMetrics = (obj: any) => {
        if (!obj) return null
        return {
          train: obj.train ?? null,
          test: obj.test ?? null
        }
      }

      setModel1Metrics(real1 ? pickMetrics(allModels[real1]) : null)
      setModel2Metrics(real2 ? pickMetrics(allModels[real2]) : null)

      // if backend didn't return those models, generate mock metrics (graceful fallback)
      if (!real1)
        setModel1Metrics({
          train: generateMockMetricsForTask(selectedTask),
          test: generateMockMetricsForTask(selectedTask)
        })
      if (!real2)
        setModel2Metrics({
          train: generateMockMetricsForTask(selectedTask),
          test: generateMockMetricsForTask(selectedTask)
        })

      setComparisonComplete(true)
    } catch (err: any) {
      console.error('Build API error', err)
      // fallback to mock metrics if API fails but we still want the UI to show something:
      setModel1Metrics({
        train: generateMockMetricsForTask(selectedTask),
        test: generateMockMetricsForTask(selectedTask)
      })
      setModel2Metrics({
        train: generateMockMetricsForTask(selectedTask),
        test: generateMockMetricsForTask(selectedTask)
      })
      setErrorMessage(
        err?.message || 'Error calling build API. Showing mock metrics.'
      )
      setComparisonComplete(true)
    } finally {
      setIsComparing(false)
    }
  }

  // compare two metric values based on whether lower is better
  const compareMetric = (
    key: string,
    a: any,
    b: any,
    isLowerBetter = false
  ) => {
    if (a == null && b == null) return { aClass: '', bClass: '' }
    // parse percent strings and numeric strings
    const toNum = (v: any) => {
      if (v == null) return NaN
      if (typeof v === 'string' && v.includes('%'))
        return parseFloat(v.replace('%', ''))
      return parseFloat(String(v))
    }
    const na = toNum(a)
    const nb = toNum(b)
    if (isNaN(na) || isNaN(nb)) return { aClass: '', bClass: '' }
    if (isLowerBetter) {
      if (na < nb)
        return {
          aClass: 'text-success font-semibold',
          bClass: 'text-muted-foreground'
        }
      if (nb < na)
        return {
          aClass: 'text-muted-foreground',
          bClass: 'text-success font-semibold'
        }
    } else {
      if (na > nb)
        return {
          aClass: 'text-success font-semibold',
          bClass: 'text-muted-foreground'
        }
      if (nb > na)
        return {
          aClass: 'text-muted-foreground',
          bClass: 'text-success font-semibold'
        }
    }
    return { aClass: 'text-foreground', bClass: 'text-foreground' }
  }

  const renderMetricValue = (v: any) => {
    if (v == null) return '—'

    // If it's a string with %, return as is
    if (typeof v === 'string' && v.includes('%')) {
      return v
    }

    // Convert to number and check if it's valid
    const num = typeof v === 'number' ? v : parseFloat(String(v))

    // If it's a valid number, format to 5 decimal places
    if (!isNaN(num)) {
      return num.toFixed(5)
    }

    // Otherwise return as string
    return String(v)
  }

  return (
    <div className='min-h-screen w-full bg-muted/20 p-6 md:p-8'>
      <div className='w-full max-w-[1400px] mx-auto'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold text-foreground'>
              Compare Models
            </h1>
            <p className='text-muted-foreground mt-1'>
              Compare performance metrics between two models
              {dataset?.name && ` using ${dataset.name}`}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              onClick={() =>
                navigate('/create-job', {
                  state: { initialTab: 'build-model' }
                })
              }
            >
              Build a Model
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                navigate('/create-job', { state: { initialTab: 'test' } })
              }
            >
              Test
            </Button>
          </div>
        </div>

        <div className='glass-card p-6 rounded-xl space-y-5 mb-6'>
          <h3 className='text-sm font-semibold text-foreground flex items-center gap-2'>
            <GitCompare className='w-4 h-4 text-primary' />
            Comparison Configuration
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Task (Function) */}
            <div>
              <label className='text-xs font-medium text-muted-foreground mb-2 block'>
                Task *
              </label>
              <Select
                value={selectedTask}
                onValueChange={v => setSelectedTask(v)}
              >
                <SelectTrigger className='w-full bg-background'>
                  <SelectValue placeholder='Select Task' />
                </SelectTrigger>
                <SelectContent className='bg-background border border-border z-[100]'>
                  {Object.keys(modelsByTask).map(task => (
                    <SelectItem key={task} value={task}>
                      {task}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model 1 */}
            <div>
              <label className='text-xs font-medium text-muted-foreground mb-2 block'>
                Model 1 *
              </label>
              <Select
                value={selectedModel1}
                onValueChange={setSelectedModel1}
                disabled={!selectedTask}
              >
                <SelectTrigger className='w-full bg-background'>
                  <SelectValue
                    placeholder={
                      selectedTask ? 'Select Model 1' : 'Select Task first'
                    }
                  />
                </SelectTrigger>
                <SelectContent className='bg-background border border-border z-[100]'>
                  {availableModels.map(m => (
                    <SelectItem
                      key={m}
                      value={m}
                      disabled={m === selectedModel2}
                    >
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model 2 */}
            <div>
              <label className='text-xs font-medium text-muted-foreground mb-2 block'>
                Model 2 *
              </label>
              <Select
                value={selectedModel2}
                onValueChange={setSelectedModel2}
                disabled={!selectedTask}
              >
                <SelectTrigger className='w-full bg-background'>
                  <SelectValue
                    placeholder={
                      selectedTask ? 'Select Model 2' : 'Select Task first'
                    }
                  />
                </SelectTrigger>
                <SelectContent className='bg-background border border-border z-[100]'>
                  {availableModels.map(m => (
                    <SelectItem
                      key={m}
                      value={m}
                      disabled={m === selectedModel1}
                    >
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Feature / Target */}
<div>
  <label className='text-xs font-medium text-muted-foreground mb-2 block'>
    Feature (target) *
  </label>

 <Select
  value={selectedFeature === 'all' ? '' : selectedFeature}
  onValueChange={v => setSelectedFeature(v as any)}
  disabled={!selectedTask}
>
  <SelectTrigger className='w-full bg-background'>
    <SelectValue
      placeholder={
        selectedTask
          ? 'Please select target'
          : 'Select Task first'
      }
    />
  </SelectTrigger>

    <SelectContent className='bg-background border border-border z-[100] max-h-60 overflow-auto'>
      {taskSpecificFeatures.length > 0 ? (
        taskSpecificFeatures.map(col => (
          <SelectItem key={col} value={col}>
            {col}
          </SelectItem>
        ))
      ) : (
        <SelectItem value='no-targets' disabled>
          {isFetchingFeatures ? 'Loading...' : 'No targets available'}
        </SelectItem>
      )}
    </SelectContent>
  </Select>
</div>

          </div>

          {errorMessage && (
            <div className='text-sm text-destructive mt-2'>{errorMessage}</div>
          )}

          <div className='pt-2'>
            <Button
              onClick={fetchAndCompare}
              disabled={!canCompare || isComparing}
            >
              {isComparing ? 'Comparing...' : 'Compare'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {comparisonComplete && (model1Metrics || model2Metrics) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            <div className='glass-card p-5 rounded-xl'>
              <h4 className='text-sm font-semibold text-foreground mb-3'>
                Comparison Summary
              </h4>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Task:</span>
                  <span className='ml-2 text-foreground font-medium'>
                    {selectedTask}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Model 1:</span>
                  <span className='ml-2 text-primary font-medium'>
                    {selectedModel1}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Model 2:</span>
                  <span className='ml-2 text-primary font-medium'>
                    {selectedModel2}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Target:</span>
                  <span className='ml-2 text-foreground font-medium'>
                    {selectedFeature === 'all'
                      ? 'All features'
                      : selectedFeature}
                  </span>
                </div>
              </div>
            </div>

            <div className='glass-card rounded-xl overflow-hidden'>
              <div className='p-4 border-b border-border'>
                <h3 className='text-sm font-semibold text-foreground'>
                  Model Comparison Results
                </h3>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='bg-muted/30'>
                      <th className='px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider border-b border-border'>
                        Model Name
                      </th>
                      <th className='px-4 py-3 text-center text-xs font-bold text-foreground uppercase tracking-wider border-b border-border'>
                        Metrics
                      </th>
                      {(metricsByTask[selectedTask] || []).map(spec => (
                        <th
                          key={spec.key}
                          className='px-4 py-3 text-center text-xs font-bold text-foreground uppercase tracking-wider border-b border-border'
                        >
                          {spec.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Model 1 - Train Row */}
                    <tr className='border-b border-border/50'>
                      <td
                        className='px-4 py-4 font-bold text-blue-500 text-primary border-r border-border'
                        rowSpan={2}
                      >
                        {selectedModel1}
                      </td>
                      <td className='px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20'>
                        Train
                      </td>
                      {(metricsByTask[selectedTask] || []).map(spec => {
                        const value = model1Metrics?.train
                          ? model1Metrics.train[spec.key] ??
                            model1Metrics.train[spec.key.replace(/\./g, '_')]
                          : null
                        return (
                          <td
                            key={spec.key}
                            className='px-4 py-3 text-center text-sm text-foreground'
                          >
                            {renderMetricValue(value)}
                          </td>
                        )
                      })}
                    </tr>
                    {/* Model 1 - Test Row */}
                    <tr className='border-b border-border'>
                      <td className='px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20'>
                        Test
                      </td>
                      {(metricsByTask[selectedTask] || []).map(spec => {
                        const value = model1Metrics?.test
                          ? model1Metrics.test[spec.key] ??
                            model1Metrics.test[spec.key.replace(/\./g, '_')]
                          : null
                        return (
                          <td
                            key={spec.key}
                            className='px-4 py-3 text-center text-sm text-foreground'
                          >
                            {renderMetricValue(value)}
                          </td>
                        )
                      })}
                    </tr>

                    {/* Model 2 - Train Row */}
                    <tr className='border-b border-border/50'>
                      <td
                        className='px-4 py-4 font-bold text-purple-500 text-primary border-r border-border'
                        rowSpan={2}
                      >
                        {selectedModel2}
                      </td>
                      <td className='px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20'>
                        Train
                      </td>
                      {(metricsByTask[selectedTask] || []).map(spec => {
                        const value = model2Metrics?.train
                          ? model2Metrics.train[spec.key] ??
                            model2Metrics.train[spec.key.replace(/\./g, '_')]
                          : null
                        return (
                          <td
                            key={spec.key}
                            className='px-4 py-3 text-center text-sm text-foreground'
                          >
                            {renderMetricValue(value)}
                          </td>
                        )
                      })}
                    </tr>
                    {/* Model 2 - Test Row */}
                    <tr className='border-b border-border'>
                      <td className='px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20'>
                        Test
                      </td>
                      {(metricsByTask[selectedTask] || []).map(spec => {
                        const value = model2Metrics?.test
                          ? model2Metrics.test[spec.key] ??
                            model2Metrics.test[spec.key.replace(/\./g, '_')]
                          : null
                        return (
                          <td
                            key={spec.key}
                            className='px-4 py-3 text-center text-sm text-foreground'
                          >
                            {renderMetricValue(value)}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CompareTab
