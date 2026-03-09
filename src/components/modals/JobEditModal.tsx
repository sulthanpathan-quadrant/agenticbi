import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useJobs } from '@/contexts/JobsContext';
import { useJobs } from '../contexts/JobsContext';
import { Job } from '../types/jobs';

interface JobEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

// UI Display Names
const modelsByFeature: Record<string, string[]> = {
  Classification: ['Logistic Regression', 'Random Forest', 'Gradient Boosting', 'XGBoost'],
  Regression: ['Ridge', 'Random Forest', 'Gradient Boosting', 'XGBoost'],
  Forecasting: ['ARIMA', 'Prophet', 'XGBoost', 'LightGBM', 'CatBoost'],
  Multi_Step_Forecasting: ['XGBoost', 'LightGBM', 'CatBoost'], 
  Clustering: ['KMeans', 'KMeans++', 'DBSCAN', 'GMM'],
  'Anomaly Detection': ['Isolation Forest', 'One-Class SVM', 'Local Outlier Factor (LOF)', 'Elliptic Envelope'],
};

// Map UI model names to API model names
const modelNameToAPI: Record<string, string> = {
  'Logistic Regression': 'logistic_regression',
  'Random Forest': 'random_forest',
  'Gradient Boosting': 'gradient_boosting',
  'XGBoost': 'xgboost',
  'Ridge': 'ridge',
  'ARIMA': 'arima',
  'Prophet': 'prophet',
  'LightGBM': 'lightgbm',
  'CatBoost': 'catboost',
  'KMeans': 'kmeans',
  'KMeans++': 'kmeans++',
  'DBSCAN': 'dbscan',
  'GMM': 'gmm',
  'Isolation Forest': 'isolation_forest',
  'One-Class SVM': 'one_class_svm',
  'Local Outlier Factor (LOF)': 'lof',
  'Elliptic Envelope': 'elliptic_envelope'
};

// ✅ Reverse mapping: API names to UI names
const apiModelToUI: Record<string, string> = {
  'logistic_regression': 'Logistic Regression',
  'random_forest': 'Random Forest',
  'gradient_boosting': 'Gradient Boosting',
  'xgboost': 'XGBoost',
  'ridge': 'Ridge',
  'arima': 'ARIMA',
  'prophet': 'Prophet',
  'lightgbm': 'LightGBM',
  'catboost': 'CatBoost',
  'kmeans': 'KMeans',
  'kmeans++': 'KMeans++',
  'dbscan': 'DBSCAN',
  'gmm': 'GMM',
  'isolation_forest': 'Isolation Forest',
  'one_class_svm': 'One-Class SVM',
  'lof': 'Local Outlier Factor (LOF)',
  'elliptic_envelope': 'Elliptic Envelope'
};

const featureTypes = Object.keys(modelsByFeature);

// Map UI feature names to API task names
const featureToTaskMap: Record<string, string> = {
  'Classification': 'classification',
  'Regression': 'regression',
  'Forecasting': 'forecasting',
  'Clustering': 'clustering',
  'Multi_Step_Forecasting': 'multistep_forecasting',
  'Anomaly Detection': 'anomaly_detection',
};

const taskToFeatureMap: Record<string, string> = {
  'classification': 'Classification',
  'regression': 'Regression',
  'forecasting': 'Forecasting',
  'multistep_forecasting': 'Multi_Step_Forecasting',
  'clustering': 'Clustering',
  'anomaly_detection': 'Anomaly Detection',
};

const JobEditModal = ({ isOpen, onClose, job }: JobEditModalProps) => {
  const { updateJob } = useJobs();
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
  const [blobPath, setBlobPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);


  // ========== EFFECT 1: INITIALIZE STATE FROM JOB ==========
  useEffect(() => {
    if (job && isOpen) {
      console.log('🔍 Initializing modal with job:', job);
      
      let taskType = '';
      
      if (job.task_type) {
       const normalizedTask = job.task_type
            .toLowerCase()
            .replace(/\s+/g, '_');
        taskType = taskToFeatureMap[normalizedTask] || '';
        console.log('📋 Task from API:', job.task_type, '→', taskType);
      }
      
      if (!taskType && job.category) {
        taskType = job.category;
        console.log('📋 Task from category:', taskType);
      }
      
      if (!taskType && job.feature) {
        taskType = job.feature;
        console.log('📋 Task from feature:', taskType);
      }
      
      setSelectedFeature(taskType);
      console.log('✅ Set feature to:', taskType);
      
      let modelToSet = '';
      if (job.model) {
        if (Object.keys(modelNameToAPI).includes(job.model)) {
          modelToSet = job.model;
        } else {
          const normalizedModel = job.model.toLowerCase();
          modelToSet = apiModelToUI[normalizedModel] || '';
        }
      }
      
      if (!modelToSet && job.best_model) {
        const normalizedModel = job.best_model.toLowerCase();
        modelToSet = apiModelToUI[normalizedModel] || '';
      }
      
      setSelectedModel(modelToSet);
      console.log('✅ Set model to:', modelToSet);
      
      setSelectedTarget(job.target || '');
      console.log('✅ Set target to:', job.target);
      
      setSelectedFeatures(job.features || []);
      
      setHasChanges(false);
      setSuccessMessage(null);
      setError(null);
    }
  }, [job, isOpen]);

  // ========== ✅✅✅ EFFECT 2: FETCH DATASET FEATURES (ADD THIS!) ==========
  useEffect(() => {
    if (isOpen && job?.datasetName) {
      console.log('📥 Fetching dataset features for:', job.datasetName);
      fetchDatasetFeatures();
    }
  }, [isOpen, job?.datasetName]);

  // ========== EFFECT 3: TRACK CHANGES ==========
  useEffect(() => {
    if (!job) return;
    
    const featureChanged = selectedFeature !== (job.category || job.feature);
    const modelChanged = selectedModel !== (apiModelToUI[job.model?.toLowerCase()] || job.model || '');
    const targetChanged = selectedTarget !== (job.target || '');
    
    setHasChanges(featureChanged || modelChanged || targetChanged);
  }, [selectedFeature, selectedModel, selectedTarget, job]);
  

const fetchDatasetFeatures = async () => {
    if (!job?.datasetName) {
      setError('Dataset name not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userDataString = localStorage.getItem('aivolve_user');
      if (!userDataString) {
        throw new Error('User not found');
      }

      const userData = JSON.parse(userDataString);
      const userEmail = userData.email;
      const agentName = userData.agent_name || userData.name || 'default';

      if (!userEmail) {
        throw new Error('Email not found');
      }

      // ✅ Step 1: Get blob_path from list_files
      const listFilesUrl = `https://api.veriton.ai/api/service3/list_files?user_email=${encodeURIComponent(userEmail)}&agent_name=${encodeURIComponent(agentName)}`;
      
      const listResponse = await fetch(listFilesUrl, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });

      if (!listResponse.ok) {
        throw new Error(`Failed to fetch files list: ${listResponse.status}`);
      }

      const listData = await listResponse.json();

      // ✅ Check both regular files and build_model_files
      let matchingFile = null;
      
      if (listData.files && Array.isArray(listData.files)) {
        matchingFile = listData.files.find((file: any) => 
          file.filename === job.datasetName
        );
      }
      
      if (!matchingFile && listData.build_model_files && Array.isArray(listData.build_model_files)) {
        matchingFile = listData.build_model_files.find((file: any) => 
          file.filename === job.datasetName
        );
      }

      if (!matchingFile) {
        throw new Error(`Dataset "${job.datasetName}" not found`);
      }

      // ✅ Store the actual blob_name from API
      setBlobPath(matchingFile.blob_name);
      console.log('✅ Found blob path:', matchingFile.blob_name);

      // ✅ Step 2: Get data preview using the blob_name
      const previewUrl = `https://api.veriton.ai/api/service3/data_preview?blob_path=${encodeURIComponent(matchingFile.blob_name)}&user_email=${encodeURIComponent(userEmail)}`;
      
      const previewResponse = await fetch(previewUrl, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });

      if (!previewResponse.ok) {
        throw new Error(`Failed to fetch data preview: ${previewResponse.status}`);
      }

      const previewData = await previewResponse.json();

      if (!previewData.preview || !previewData.preview.columns) {
        throw new Error('Invalid preview data');
      }

      setAvailableFeatures(previewData.preview.columns);

      // ✅ Only set default target if job doesn't have one
      if (!job.target && previewData.preview.columns.length > 0) {
        setSelectedTarget(previewData.preview.columns[previewData.preview.columns.length - 1]);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dataset features';
      setError(errorMessage);
      console.error('Error:', err);
      setAvailableFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const availableModels = useMemo(() => {
    return selectedFeature ? modelsByFeature[selectedFeature] || [] : [];
  }, [selectedFeature]);

  const handleFeatureChange = (value: string) => {
    setSelectedFeature(value);
    setSelectedModel('');
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  useEffect(() => {
    if (selectedTarget && selectedFeatures.includes(selectedTarget)) {
      setSelectedFeatures(prev => prev.filter(f => f !== selectedTarget));
    }
  }, [selectedTarget]);

  const handleSave = async () => {
    if (!job) {
      setError('Job not found');
      return;
    }

    if (!selectedFeature) {
      setError('Please select a function');
      return;
    }


    if (!selectedTarget) {
      setError('Please select a target column');
      return;
    }

    if (!blobPath) {
      setError('Blob path not found. Please retry.');
      return;
    }

    setTraining(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userDataString = localStorage.getItem('aivolve_user');
      if (!userDataString) {
        throw new Error('User not found');
      }

      const userData = JSON.parse(userDataString);
      const userEmail = userData.email;

      console.log('Downloading file from blob storage...');
      const downloadUrl = `https://api.veriton.ai/api/service3/download_predictions?blob_path=${encodeURIComponent(blobPath)}&user_email=${encodeURIComponent(userEmail)}`;
      
      const downloadResponse = await fetch(downloadUrl, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });

      if (!downloadResponse.ok) {
        throw new Error(`Failed to download file: ${downloadResponse.status}`);
      }

      const fileBlob = await downloadResponse.blob();

      console.log('File downloaded successfully, size:', fileBlob.size);

      const formData = new FormData();
      formData.append('file', fileBlob, job.datasetName);
      formData.append('task', featureToTaskMap[selectedFeature] || selectedFeature.toLowerCase());
      formData.append('target', selectedTarget);
      formData.append('user_email', userEmail);
      
      const finalFeatures = selectedFeatures.filter(f => f !== selectedTarget);
      
      
      const apiModelName = selectedModel ? (modelNameToAPI[selectedModel] || selectedModel.toLowerCase().replace(/\s+/g, '_')) : '';
      formData.append('models', apiModelName);
      formData.append('metric', '');
      formData.append('preprocessing_mode', 'simple');
      formData.append('use_cleaning', 'true');
      formData.append('use_feature_selection', 'true');
      formData.append('use_optuna', 'true');
      formData.append('optuna_trials', '2');
      formData.append('time_budget', '180');
      formData.append('test_size', '0.2');
      formData.append('test_file', '');
      
      console.log('Training with:', {
        task: featureToTaskMap[selectedFeature],
        target: selectedTarget,
        features: finalFeatures,
        model: apiModelName || 'auto'
      });

      console.log('Building ML model...');

      const buildResponse = await fetch(
        'https://api.veriton.ai/api/service3/build_ml_model',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!buildResponse.ok) {
        const errorData = await buildResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || `API failed: ${buildResponse.status}`);
      }

      const result = await buildResponse.json();
      console.log('Model built successfully:', result);

      // ✅ Convert API model name back to UI format
      const uiModelName = apiModelToUI[result.best_model?.toLowerCase()] || result.best_model;

      updateJob(job.id, {
        id: result.model_id,
        feature: selectedFeature,
        model: uiModelName, // ✅ Store UI format
        features: selectedFeatures,
        category: selectedFeature,
        target: selectedTarget,
        status: 'completed',
        task_type: result.task_type,
        testAccuracy: result.primary_score?.toString(),
      });

      setSuccessMessage(
        `✓ Model trained successfully! ${result.primary_metric}: ${result.primary_score.toFixed(2)}`
      );

      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to build model';
      setError(errorMessage);
      console.error('Error building model:', err);
    } finally {
      setTraining(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccessMessage(null);
    setAvailableFeatures([]);
    onClose();
  };

  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[301] p-4"
          >
            <div 
              className="relative w-[550px] max-w-[90vw] max-h-[90vh] overflow-hidden bg-card rounded-2xl border border-border shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="job-edit-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 id="job-edit-modal-title" className="text-lg font-semibold text-foreground">
                      Edit Job Configuration
                    </h2>
                    {job.datasetName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Dataset: {job.datasetName}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={training}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {successMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                    {!training && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchDatasetFeatures}
                        className="mt-3"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Function <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={selectedFeature} 
                    onValueChange={handleFeatureChange}
                    disabled={training}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select Function" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-[400]">
                      {featureTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                    disabled={!selectedFeature || training}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder={selectedFeature ? "Auto-select best model" : "Select function first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-[400]">
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Target Column <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={selectedTarget} 
                    onValueChange={setSelectedTarget}
                    disabled={loading || training || availableFeatures.length === 0}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select target column" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-[400]">
                      {availableFeatures.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Select the column you want to predict
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Features {selectedFeatures.length > 0 && `(${selectedFeatures.length} selected)`}
                  </label>
                  
                  {loading ? (
                    <div className="border border-border rounded-lg p-6 bg-background flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
                      <span className="text-sm text-muted-foreground">Loading features...</span>
                    </div>
                  ) : availableFeatures.length === 0 && !error ? (
                    <div className="border border-border rounded-lg p-6 bg-background text-center">
                      <p className="text-sm text-muted-foreground">No features available</p>
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-3 max-h-[200px] overflow-y-auto bg-background">
                      <div className="flex flex-wrap gap-2">
                        {availableFeatures.map((column) => {
                          const isTarget = column === selectedTarget;
                          const isSelected = selectedFeatures.includes(column);
                          
                          return (
                            <button
                              key={column}
                              onClick={() => !isTarget && toggleFeature(column)}
                              disabled={training || isTarget}
                              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                                isTarget
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                              } ${training ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={isTarget ? 'Target column (excluded from features)' : ''}
                            >
                              {column}
                              {isTarget && ' (Target)'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                
                </div>
              </div>

              <div className="flex-shrink-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={training}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={!selectedFeature || loading || training || !selectedTarget || !hasChanges}
                  className="min-w-[160px]"
                >
                  {training ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Training Model...
                    </>
                  ) : (
                    'Save Changes & Run'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobEditModal;