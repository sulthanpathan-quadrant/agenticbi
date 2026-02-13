// import { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Play, Eye, Edit, Plus, Grid3X3, BarChart2, RefreshCw, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// // import Header from '@/components/layout/Header';
// import Header from '@/components/layout/Header';
// // import Chatbot from '@/components/chatbot/Chatbot';
// import Chatbot from '@/components/chatbot/Chatbot';
// // import { useJobs } from '@/contexts/JobsContext';
// import { useJobs } from '@/components/contexts/JobsContext';
// // import { useAuth } from '@/contexts/AuthContext';
// import { useAuth } from '@/components/contexts/AuthContext';
// // import { Job } from '@/types/job';
// import { Job } from '@/components/types/jobs';
// // import JobViewModal from '@/components/modals/JobViewModal';
// import JobViewModal from '@/components/modals/JobViewModal';
// // import JobEditModal from '@/components/modals/JobEditModal';
// import JobEditModal from '@/components/modals/JobEditModal';
 
// // Map UI feature names to API task names
// const featureToTaskMap: Record<string, string> = {
//   'Classification': 'classification',
//   'Regression': 'regression',
//   'Forecasting': 'forecasting',
//   'Clustering': 'clustering',
//   'Anomaly Detection': 'anomaly_detection',
// };
 
// // Map UI model names to API model names
// const modelNameToAPI: Record<string, string> = {
//   'Logistic Regression': 'logistic_regression',
//   'Random Forest': 'random_forest',
//   'Gradient Boosting': 'gradient_boosting',
//   'XGBoost': 'xgboost',
//   'Ridge': 'ridge',
//   'ARIMA': 'arima',
//   'Prophet': 'prophet',
//   'LightGBM': 'lightgbm',
//   'CatBoost': 'catboost',
//   'KMeans': 'kmeans',
//   'KMeans++': 'kmeans++',
//   'DBSCAN': 'dbscan',
//   'GMM': 'gmm',
//   'Isolation Forest': 'isolation_forest',
//   'One-Class SVM': 'one_class_svm',
//   'Local Outlier Factor (LOF)': 'lof',
//   'Elliptic Envelope': 'elliptic_envelope'
// };
 
// // Reverse mapping: API names to UI names
// const apiModelToUI: Record<string, string> = {
//   'logistic_regression': 'Logistic Regression',
//   'random_forest': 'Random Forest',
//   'gradient_boosting': 'Gradient Boosting',
//   'xgboost': 'XGBoost',
//   'ridge': 'Ridge',
//   'arima': 'ARIMA',
//   'prophet': 'Prophet',
//   'lightgbm': 'LightGBM',
//   'catboost': 'CatBoost',
//   'kmeans': 'KMeans',
//   'kmeans++': 'KMeans++',
//   'dbscan': 'DBSCAN',
//   'gmm': 'GMM',
//   'isolation_forest': 'Isolation Forest',
//   'one_class_svm': 'One-Class SVM',
//   'lof': 'Local Outlier Factor (LOF)',
//   'elliptic_envelope': 'Elliptic Envelope'
// };
 
// const AutoMLJobs = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, user} = useAuth();
//   const { jobs, loading, error, totalCount, currentPage, fetchJobs, updateJob, setCurrentPage } = useJobs();
 
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [runningJobId, setRunningJobId] = useState<string | null>(null);
//   const [runningMessage, setRunningMessage] = useState<string>('');
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [jobName, setJobName] = useState('');
 
//   const itemsPerPage = 10;
//   const totalPages = Math.ceil(totalCount / itemsPerPage);
 
// //   useEffect(() => {
// //      console.log('🔍 Auth Check:', { isAuthenticated, user })
// //     if (!isAuthenticated) {
// //       navigate('/auth');
// //     }
// //   }, [isAuthenticated, navigate]);
 
//   const filteredJobs = useMemo(() => {
//     return jobs.filter(job => {
//       return statusFilter === 'all' || job.status === statusFilter;
//     });
//   }, [jobs, statusFilter]);
 
//   const formatDate = (date: Date | null) => {
//     if (!date) return '—';
//     return new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     }).format(date).replace(/\//g, '-');
//   };
 
//   const getStatusBadge = (status: Job['status']) => {
//     const styles = {
//       completed: 'bg-emerald-100 text-emerald-700',
//       pending: 'bg-amber-100 text-amber-700',
//       running: 'bg-amber-100 text-amber-700',
//       failed: 'bg-red-100 text-red-700'
//     };
   
//     const labels = {
//       completed: 'Completed',
//       pending: 'Running',
//       running: 'Running',
//       failed: 'Failed'
//     };
   
//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
//         {labels[status]}
//       </span>
//     );
//   };
 
//   const handleRun = async (job: Job) => {
//     // Check if job has basic configuration
//     console.log('Job config:', {
//       category: job.category,
//       features: job.features,
//       target: job.target,
//       datasetName: job.datasetName
//     });
 
//     if (!job.category && !job.feature) {
//       alert('Job is missing task type (category). Please edit the job first.');
//       return;
//     }
 
//     if (!job.target) {
//       alert('Job is missing target column. Please edit the job first.');
//       return;
//     }
 
//     if (!job.datasetName) {
//       alert('Job is missing dataset. Please edit the job first.');
//       return;
//     }
 
//     setRunningJobId(job.id);
//     setRunningMessage('Preparing dataset...');
 
//     try {
//       const userDataString = localStorage.getItem('aivolve_user');
//       if (!userDataString) {
//         throw new Error('User not found');
//       }
 
//       const userData = JSON.parse(userDataString);
//       const userEmail = userData.email;
//       const agentName = userData.agent_name || userData.name || 'default';
//       const userId = userData.user_id || userData.id || '';
 
//       // ✅ If features are not loaded, fetch them now
//       let features = job.features || [];
     
//       if (features.length === 0) {
//         setRunningMessage('Loading dataset features...');
       
//         const blobPath = `${userId}/${agentName}/${job.datasetName}`;
//         const previewUrl = `https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/data_preview?blob_path=${encodeURIComponent(blobPath)}&user_email=${encodeURIComponent(userEmail)}`;
       
//         const previewResponse = await fetch(previewUrl, {
//           method: 'GET',
//           headers: { 'accept': 'application/json' }
//         });
 
//         if (!previewResponse.ok) {
//           throw new Error(`Failed to fetch dataset features: ${previewResponse.status}`);
//         }
 
//         const previewData = await previewResponse.json();
       
//         if (!previewData.preview?.columns) {
//           throw new Error('Invalid dataset preview');
//         }
 
//         // Get all columns except target
//         features = previewData.preview.columns.filter((col: string) => col !== job.target);
       
//         if (features.length === 0) {
//           throw new Error('No features available for training.');
//         }
 
//         console.log('Fetched features:', features);
//       }
 
//       // Step 1: Download file from blob storage
//       setRunningMessage('Downloading dataset...');
//       const blobPath = `${userId}/${agentName}/${job.datasetName}`;
//       const downloadUrl = `https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/download_predictions?blob_path=${encodeURIComponent(blobPath)}&user_email=${encodeURIComponent(userEmail)}`;
     
//       const downloadResponse = await fetch(downloadUrl, {
//         method: 'GET',
//         headers: { 'accept': 'application/json' }
//       });
 
//       if (!downloadResponse.ok) {
//         throw new Error(`Failed to download file: ${downloadResponse.status}`);
//       }
 
//       const csvText = await downloadResponse.text();
//       const fileBlob = new Blob([csvText], { type: 'text/csv' });
 
//       // Step 2: Prepare FormData for training
//       setRunningMessage('Training model... This may take a few minutes.');
//       const formData = new FormData();
//       formData.append('file', fileBlob, job.datasetName);
//       formData.append('task', featureToTaskMap[job.category] || job.category.toLowerCase());
//       formData.append('target', job.target);
//       formData.append('user_email', userEmail);
     
//       const apiModelName = job.model ? (modelNameToAPI[job.model] || job.model.toLowerCase().replace(/\s+/g, '_')) : '';
//       formData.append('models', apiModelName);
//       formData.append('metric', '');
//       formData.append('preprocessing_mode', 'simple');
//       formData.append('use_cleaning', 'true');
//       formData.append('use_feature_selection', 'true');
//       formData.append('use_optuna', 'true');
//       formData.append('optuna_trials', '2');
//       formData.append('time_budget', '180');
//       formData.append('test_size', '0.2');
//       formData.append('test_file', '');
 
//       // Step 3: Call build_ml_model API
//       const buildResponse = await fetch(
//         'https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/build_ml_model',
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );
 
//       if (!buildResponse.ok) {
//         const errorData = await buildResponse.json().catch(() => ({}));
//         throw new Error(errorData.detail || `API failed: ${buildResponse.status}`);
//       }
 
//       const result = await buildResponse.json();
//       console.log('Model trained successfully:', result);
 
//       // Convert API model name back to UI format
//       const uiModelName = apiModelToUI[result.best_model?.toLowerCase()] || result.best_model;
 
//       // Update job with new results
//       updateJob(job.id, {
//         id: result.model_id,
//         feature: job.category,
//         model: uiModelName,
//         features: features, // ✅ Save the features we used
//         category: job.category,
//         target: job.target,
//         status: 'completed',
//         task_type: result.task_type,
//         testAccuracy: result.primary_score?.toString(),
//         lastRun: new Date(),
//       });
 
//       setRunningMessage('Training complete! Opening results...');
 
//       // Wait a bit for the update to propagate
//       await new Promise(resolve => setTimeout(resolve, 500));
 
//       // Step 4: Open JobViewModal with updated job
//       const updatedJob = {
//         ...job,
//         id: result.model_id,
//         features: features,
//         status: 'completed' as const,
//         lastRun: new Date(),
//       };
     
//       setSelectedJob(updatedJob);
//       setIsViewModalOpen(true);
 
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to train model';
//       alert(`Error: ${errorMessage}`);
//       console.error('Error training model:', err);
//     } finally {
//       setRunningJobId(null);
//       setRunningMessage('');
//     }
//   };
 
//   const handleView = (job: Job) => {
//     setSelectedJob(job);
//     setIsViewModalOpen(true);
//   };
 
//   const handleEdit = (job: Job) => {
//     setSelectedJob(job);
//     setIsEditModalOpen(true);
//   };
 
//   const handleCreateJob = () => {
//     if (jobName.trim()) {
//       navigate('/workflow/automl/select-dataset', { state: { jobName: jobName.trim(), initialTab: 'data-source' } });
//       setIsCreateModalOpen(false);
//       setJobName('');
//     }
//   };
 
//   const handleRefresh = async () => {
//     await fetchJobs(currentPage);
//   };
 
// //   if (!isAuthenticated) return null;
 
//   return (
//     <div className="min-h-screen bg-muted/30">
//       <Header />
//       <main className="pt-20 px-6 pb-12">
//         <div className="max-w-7xl mx-auto">
//             {/* ================= AutoML Intro ================= */}
// <div className="mb-10">
//   <h1 className="text-3xl font-bold text-foreground">
//     AutoML Workspace
//   </h1>
//   <p className="text-muted-foreground mt-2 max-w-2xl">
//     Build, compare, and test machine learning models automatically using your datasets.
//     Manage all trained models below.
//   </p>
// </div>
 
// {/* ================= AutoML Actions ================= */}
// <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//   {/* Build Model */}
//   <div className="border rounded-xl p-6 bg-card">
//     <h3 className="text-lg font-semibold mb-2">Build Model</h3>
//     <p className="text-sm text-muted-foreground mb-4">
//       Train a new machine learning model by selecting dataset, target column and algorithm.
//     </p>
//     <Button
//  onClick={() =>
//           navigate("/workflow/automl/select-dataset")
//         }
//     >
//       Build Model
//     </Button>
//   </div>
 
//   {/* Compare */}
//   <div className="border rounded-xl p-6 bg-card">
//     <h3 className="text-lg font-semibold mb-2">Compare Models</h3>
//     <p className="text-sm text-muted-foreground mb-4">
//       Compare multiple trained models to identify the best performing one.
//     </p>
//     <Button
//   variant="outline"
//   onClick={() => navigate('/workflow/automl/select-dataset', { 
//     state: { mode: 'compare' } // Pass mode indicator
//   })}
// >
//   Compare
// </Button>
//   </div>
 
//   {/* Test */}
//   <div className="border rounded-xl p-6 bg-card">
//     <h3 className="text-lg font-semibold mb-2">Test Model</h3>
//     <p className="text-sm text-muted-foreground mb-4">
//       Test a trained model on new data before deployment.
//     </p>
//     <Button
//       variant="outline"
//   onClick={() =>
//           navigate("/workflow/automl/select-dataset")
//         }
//     >
//       Test
//     </Button>
//   </div>
// </div>
 
//           {/* Header */}
//           <div className="flex items-start justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-1">Trained Models</h1>
//               {/* <p className="text-muted-foreground">All machine learning models created using AutoML.</p> */}
//             </div>
//             <div className="flex items-center gap-3">
//               {/* <Button
//                 variant="outline"
//                 onClick={() => navigate('/workflow/automl/create-job', { state: { initialTab: 'data-source', targetTab: 'compare' } })}
//               >
//                 Compare
//               </Button> */}
//               {/* <Button
//                 variant="outline"
//                 onClick={() => navigate('/workflow/automl/create-job', { state: { initialTab: 'test' } })}
//               >
//                 Test
//               </Button> */}
//             </div>
//           </div>
 
//           {/* Error Display */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
//               <p className="text-red-700 text-sm">{error}</p>
//               <Button variant="outline" size="sm" onClick={handleRefresh}>
//                 Try Again
//               </Button>
//             </div>
//           )}
 
//           {/* Running Job Status */}
//           {runningJobId && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
//               <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
//               <div>
//                 <p className="text-blue-800 font-medium text-sm">Training in progress...</p>
//                 <p className="text-blue-600 text-xs mt-0.5">{runningMessage}</p>
//               </div>
//             </div>
//           )}
 
//           {/* Filters Row */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
//               {['all', 'completed', 'running', 'failed'].map(status => (
//                 <button
//                   key={status}
//                   onClick={() => setStatusFilter(status)}
//                   className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
//                     statusFilter === status
//                       ? 'bg-primary text-primary-foreground'
//                       : 'text-muted-foreground hover:text-foreground'
//                   }`}
//                 >
//                   {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
 
//             {/* <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-10 w-10"
//                 onClick={handleRefresh}
//                 disabled={loading}
//               >
//                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               </Button>
//               <Button onClick={() => navigate('/workflow/automl/create-job', { state: { initialTab: 'data-source' } })} className="h-10">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Create Job
//               </Button>
//             </div> */}
//           </div>
 
//           {/* Jobs Table */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-xl border border-border overflow-hidden"
//           >
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-border">
//                     <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Job</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Category</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Model</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Created At</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Last Run</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-primary">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <RefreshCw className="w-5 h-5 animate-spin text-primary" />
//                           <span className="text-muted-foreground">Loading jobs...</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : filteredJobs.length === 0 ? (
//   <tr>
//     <td colSpan={7} className="px-6 py-16 text-center">
//       <h3 className="text-lg font-semibold mb-2">
//         No models created yet
//       </h3>
//       <p className="text-sm text-muted-foreground mb-4">
//         Start by building your first AutoML model.
//       </p>
//       <Button
//         onClick={() =>
//           navigate("/workflow/automl/select-dataset")
//         }
//       >
//         Build Your First Model
//       </Button>
//     </td>
//   </tr>
// ) : (
//                     filteredJobs.map((job, index) => {
//                       const jobNumber = (currentPage - 1) * itemsPerPage + index + 1;
//                       return (
//                         <motion.tr
//                           key={job.id}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: index * 0.03 }}
//                           className="border-b border-border/50 hover:bg-muted/20"
//                         >
//                           <td className="px-6 py-4 font-medium text-foreground">Job_{jobNumber}</td>
//                           <td className="px-6 py-4 text-primary">{job.category || 'Unknown'}</td>
//                           <td className="px-6 py-4 text-muted-foreground">{job.model}</td>
//                           <td className="px-6 py-4 text-muted-foreground">{formatDate(job.createdAt)}</td>
//                           <td className="px-6 py-4 text-muted-foreground">{formatDate(job.lastRun)}</td>
//                           <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-3">
//                               <button
//                                 onClick={() => handleRun(job)}
//                                 disabled={runningJobId === job.id}
//                                 className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 title="Run job"
//                               >
//                                 {runningJobId === job.id ? (
//                                   <Loader2 className="w-5 h-5 animate-spin" />
//                                 ) : (
//                                   <Play className="w-5 h-5" />
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => handleView(job)}
//                                 className="text-muted-foreground hover:text-foreground transition-colors"
//                                 title="View details"
//                               >
//                                 <Eye className="w-5 h-5" />
//                               </button>
//                               <button
//                                 onClick={() => handleEdit(job)}
//                                 className="text-muted-foreground hover:text-foreground transition-colors"
//                                 title="Edit job"
//                               >
//                                 <Edit className="w-5 h-5" />
//                               </button>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>
 
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-6">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
//               >
//                 ‹
//               </button>
//               {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
//                 const page = i + 1;
//                 if (totalPages <= 10 || page <= 3 || page > totalPages - 2 || Math.abs(page - currentPage) <= 1) {
//                   return (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
//                         currentPage === page
//                           ? 'bg-primary text-primary-foreground'
//                           : 'text-muted-foreground hover:text-foreground'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   );
//                 } else if (page === 4 && currentPage > 5) {
//                   return <span key="dots1" className="text-muted-foreground">...</span>;
//                 } else if (page === totalPages - 2 && currentPage < totalPages - 4) {
//                   return <span key="dots2" className="text-muted-foreground">...</span>;
//                 }
//                 return null;
//               })}
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
//               >
//                 ›
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
 
//       {/* Create Job Modal */}
//       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Create New Job</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="job-name">Job Name</Label>
//               <Input
//                 id="job-name"
//                 placeholder="Enter job name..."
//                 value={jobName}
//                 onChange={(e) => setJobName(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') handleCreateJob();
//                 }}
//                 autoFocus
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleCreateJob} disabled={!jobName.trim()}>
//               Next: Select Datasource
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
 
//       {/* Modals */}
//       <JobViewModal
//         isOpen={isViewModalOpen}
//         onClose={() => setIsViewModalOpen(false)}
//         job={selectedJob}
//       />
 
//       <JobEditModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         job={selectedJob}
//       />
 
//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// };
 
// export default AutoMLJobs;
 


import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Eye, Edit, Plus, Grid3X3, BarChart2, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import Header from '@/components/layout/Header';
import Header from '@/components/layout/Header';
// import Chatbot from '@/components/chatbot/Chatbot';
import Chatbot from '@/components/chatbot/Chatbot';
// import { useJobs } from '@/contexts/JobsContext';
import { useJobs } from '@/components/contexts/JobsContext';
// import { useAuth } from '@/contexts/AuthContext';
import { useAuth } from '@/components/contexts/AuthContext';
// import { Job } from '@/types/job';
import { Job } from '@/components/types/jobs';
// import JobViewModal from '@/components/modals/JobViewModal';
import JobViewModal from '@/components/modals/JobViewModal';
// import JobEditModal from '@/components/modals/JobEditModal';
import JobEditModal from '@/components/modals/JobEditModal';
 
// Map UI feature names to API task names
const featureToTaskMap: Record<string, string> = {
  'Classification': 'classification',
  'Regression': 'regression',
  'Forecasting': 'forecasting',
  'Clustering': 'clustering',
  'Anomaly Detection': 'anomaly_detection',
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
 
// Reverse mapping: API names to UI names
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
 
const AutoMLJobs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user} = useAuth();
  const { jobs, loading, error, totalCount, currentPage, fetchJobs, updateJob, setCurrentPage } = useJobs();
 
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const [runningMessage, setRunningMessage] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [jobName, setJobName] = useState('');
 
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
 
//   useEffect(() => {
//      console.log('🔍 Auth Check:', { isAuthenticated, user })
//     if (!isAuthenticated) {
//       navigate('/auth');
//     }
//   }, [isAuthenticated, navigate]);
 
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      return statusFilter === 'all' || job.status === statusFilter;
    });
  }, [jobs, statusFilter]);
 
  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date).replace(/\//g, '-');
  };
 
  const getStatusBadge = (status: Job['status']) => {
    const styles = {
      completed: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      running: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700'
    };
   
    const labels = {
      completed: 'Completed',
      pending: 'Running',
      running: 'Running',
      failed: 'Failed'
    };
   
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };
 
  const handleRun = async (job: Job) => {
    // Check if job has basic configuration
    console.log('Job config:', {
      category: job.category,
      features: job.features,
      target: job.target,
      datasetName: job.datasetName
    });
 
    if (!job.category && !job.feature) {
      alert('Job is missing task type (category). Please edit the job first.');
      return;
    }
 
    if (!job.target) {
      alert('Job is missing target column. Please edit the job first.');
      return;
    }
 
    if (!job.datasetName) {
      alert('Job is missing dataset. Please edit the job first.');
      return;
    }
 
    setRunningJobId(job.id);
    setRunningMessage('Preparing dataset...');
 
    try {
      const userDataString = localStorage.getItem('aivolve_user');
      if (!userDataString) {
        throw new Error('User not found');
      }
 
      const userData = JSON.parse(userDataString);
      const userEmail = userData.email;
      const agentName = userData.agent_name || userData.name || 'default';
      const userId = userData.user_id || userData.id || '';
 
      // ✅ If features are not loaded, fetch them now
      let features = job.features || [];
     
      if (features.length === 0) {
        setRunningMessage('Loading dataset features...');
       
        const blobPath = `${userId}/${agentName}/${job.datasetName}`;
        const previewUrl = `https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/data_preview?blob_path=${encodeURIComponent(blobPath)}&user_email=${encodeURIComponent(userEmail)}`;
       
        const previewResponse = await fetch(previewUrl, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });
 
        if (!previewResponse.ok) {
          throw new Error(`Failed to fetch dataset features: ${previewResponse.status}`);
        }
 
        const previewData = await previewResponse.json();
       
        if (!previewData.preview?.columns) {
          throw new Error('Invalid dataset preview');
        }
 
        // Get all columns except target
        features = previewData.preview.columns.filter((col: string) => col !== job.target);
       
        if (features.length === 0) {
          throw new Error('No features available for training.');
        }
 
        console.log('Fetched features:', features);
      }
 
      // Step 1: Download file from blob storage
      setRunningMessage('Downloading dataset...');
      const blobPath = `${userId}/${agentName}/${job.datasetName}`;
      const downloadUrl = `https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/download_predictions?blob_path=${encodeURIComponent(blobPath)}&user_email=${encodeURIComponent(userEmail)}`;
     
      const downloadResponse = await fetch(downloadUrl, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });
 
      if (!downloadResponse.ok) {
        throw new Error(`Failed to download file: ${downloadResponse.status}`);
      }
 
      const csvText = await downloadResponse.text();
      const fileBlob = new Blob([csvText], { type: 'text/csv' });
 
      // Step 2: Prepare FormData for training
      setRunningMessage('Training model... This may take a few minutes.');
      const formData = new FormData();
      formData.append('file', fileBlob, job.datasetName);
      formData.append('task', featureToTaskMap[job.category] || job.category.toLowerCase());
      formData.append('target', job.target);
      formData.append('user_email', userEmail);
     
      const apiModelName = job.model ? (modelNameToAPI[job.model] || job.model.toLowerCase().replace(/\s+/g, '_')) : '';
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
 
      // Step 3: Call build_ml_model API
      const buildResponse = await fetch(
        'https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/build_ml_model',
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
      console.log('Model trained successfully:', result);
 
      // Convert API model name back to UI format
      const uiModelName = apiModelToUI[result.best_model?.toLowerCase()] || result.best_model;
 
      // Update job with new results
      updateJob(job.id, {
        id: result.model_id,
        feature: job.category,
        model: uiModelName,
        features: features, // ✅ Save the features we used
        category: job.category,
        target: job.target,
        status: 'completed',
        task_type: result.task_type,
        testAccuracy: result.primary_score?.toString(),
        lastRun: new Date(),
      });
 
      setRunningMessage('Training complete! Opening results...');
 
      // Wait a bit for the update to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
 
      // Step 4: Open JobViewModal with updated job
      const updatedJob = {
        ...job,
        id: result.model_id,
        features: features,
        status: 'completed' as const,
        lastRun: new Date(),
      };
     
      setSelectedJob(updatedJob);
      setIsViewModalOpen(true);
 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to train model';
      alert(`Error: ${errorMessage}`);
      console.error('Error training model:', err);
    } finally {
      setRunningJobId(null);
      setRunningMessage('');
    }
  };
 
  const handleView = (job: Job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };
 
  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };
 
  const handleCreateJob = () => {
    if (jobName.trim()) {
      navigate('/workflow/automl/select-dataset', { state: { jobName: jobName.trim(), initialTab: 'data-source' } });
      setIsCreateModalOpen(false);
      setJobName('');
    }
  };
 
  const handleRefresh = async () => {
    await fetchJobs(currentPage);
  };
 
//   if (!isAuthenticated) return null;
 
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
            {/* ================= AutoML Intro ================= */}
<div className="mb-10 flex items-start justify-between">
  <div>
    <h1 className="text-3xl font-bold text-foreground">
      AutoML Workspace
    </h1>
    <p className="text-muted-foreground mt-2 max-w-2xl">
      Build, compare, and test machine learning models automatically using your datasets.
      Manage all trained models below.
    </p>
  </div>
 
  <Button
    variant="outline"
    onClick={() => navigate("/workflow/path-selection")}
  >
    ← Back to Path Selection
  </Button>
</div>
 
 
{/* ================= AutoML Actions ================= */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  {/* Build Model */}
  <div className="border rounded-xl p-6 bg-card">
    <h3 className="text-lg font-semibold mb-2">Build Model</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Train a new machine learning model by selecting dataset, target column and algorithm.
    </p>
    <Button
 onClick={() =>
          navigate("/workflow/automl/select-dataset")
        }
    >
      Build Model
    </Button>
  </div>
 
  {/* Compare */}
  <div className="border rounded-xl p-6 bg-card">
    <h3 className="text-lg font-semibold mb-2">Compare Models</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Compare multiple trained models to identify the best performing one.
    </p>
    <Button
  variant="outline"
  onClick={() => navigate('/workflow/automl/select-dataset', { 
    state: { mode: 'compare' } // Pass mode indicator
  })}
>
  Compare
</Button>
  </div>
 
  {/* Test */}
  <div className="border rounded-xl p-6 bg-card">
    <h3 className="text-lg font-semibold mb-2">Test Model</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Test a trained model on new data before deployment.
    </p>
    <Button
      variant="outline"
  onClick={() =>
          navigate("/workflow/automl/select-dataset")
        }
    >
      Test
    </Button>
  </div>
</div>
 
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Trained Models</h1>
              {/* <p className="text-muted-foreground">All machine learning models created using AutoML.</p> */}
            </div>
            <div className="flex items-center gap-3">
              {/* <Button
                variant="outline"
                onClick={() => navigate('/workflow/automl/create-job', { state: { initialTab: 'data-source', targetTab: 'compare' } })}
              >
                Compare
              </Button> */}
              {/* <Button
                variant="outline"
                onClick={() => navigate('/workflow/automl/create-job', { state: { initialTab: 'test' } })}
              >
                Test
              </Button> */}
            </div>
          </div>
 
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          )}
 
          {/* Running Job Status */}
          {runningJobId && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium text-sm">Training in progress...</p>
                <p className="text-blue-600 text-xs mt-0.5">{runningMessage}</p>
              </div>
            </div>
          )}
 
          {/* Filters Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
              {['all', 'completed', 'running', 'failed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    statusFilter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
 
            {/* <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={() => navigate('/workflow/automl/create-job', { state: { initialTab: 'data-source' } })} className="h-10">
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div> */}
          </div>
 
          {/* Jobs Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Job</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Model</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Created At</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Last Run</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                          <span className="text-muted-foreground">Loading jobs...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredJobs.length === 0 ? (
  <tr>
    <td colSpan={7} className="px-6 py-16 text-center">
      <h3 className="text-lg font-semibold mb-2">
        No models created yet
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Start by building your first AutoML model.
      </p>
      <Button
        onClick={() =>
          navigate("/workflow/automl/select-dataset")
        }
      >
        Build Your First Model
      </Button>
    </td>
  </tr>
) : (
                    filteredJobs.map((job, index) => {
                      const jobNumber = (currentPage - 1) * itemsPerPage + index + 1;
                      return (
                        <motion.tr
                          key={job.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-border/50 hover:bg-muted/20"
                        >
                          <td className="px-6 py-4 font-medium text-foreground">Job_{jobNumber}</td>
                          <td className="px-6 py-4 text-primary">{job.category || 'Unknown'}</td>
                          <td className="px-6 py-4 text-muted-foreground">{job.model}</td>
                          <td className="px-6 py-4 text-muted-foreground">{formatDate(job.createdAt)}</td>
                          <td className="px-6 py-4 text-muted-foreground">{formatDate(job.lastRun)}</td>
                          <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleRun(job)}
                                disabled={runningJobId === job.id}
                                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Run job"
                              >
                                {runningJobId === job.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Play className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleView(job)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                title="View details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(job)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                title="Edit job"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
 
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const page = i + 1;
                if (totalPages <= 10 || page <= 3 || page > totalPages - 2 || Math.abs(page - currentPage) <= 1) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === 4 && currentPage > 5) {
                  return <span key="dots1" className="text-muted-foreground">...</span>;
                } else if (page === totalPages - 2 && currentPage < totalPages - 4) {
                  return <span key="dots2" className="text-muted-foreground">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </main>
 
      {/* Create Job Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-name">Job Name</Label>
              <Input
                id="job-name"
                placeholder="Enter job name..."
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateJob();
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob} disabled={!jobName.trim()}>
              Next: Select Datasource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
 
      {/* Modals */}
      <JobViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        job={selectedJob}
      />
 
      <JobEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={selectedJob}
      />
 
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};
 
export default AutoMLJobs;
 