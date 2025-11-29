import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Github,
  Globe,
  Play,
  Plus,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import api from "../../api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import toast from "react-hot-toast";
import RevealOnScroll from "../../components/animations/RevealOnScroll";

const DOMAINS = ["Web Development", "AI/ML", "Data Science", "Mobile Development", "DevOps", "Cybersecurity"];

export default function Skills() {
  const [selectedDomain, setSelectedDomain] = useState("Web Development");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showQuiz, setShowQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    domain: "Web Development",
    status: "planned",
    githubUrl: "",
    liveUrl: "",
    tags: "",
  });

  const queryClient = useQueryClient();

  // Fetch roadmaps
  const { data: roadmaps = [] } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: async () => {
      const response = await api.get("/skills/roadmaps");
      return response.data;
    },
  });

  // Fetch user skills
  const { data: userSkills = [] } = useQuery({
    queryKey: ["user-skills"],
    queryFn: async () => {
      const response = await api.get("/skills/skills");
      return response.data;
    },
  });

  // Fetch user projects
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await api.get("/skills/projects");
      return response.data;
    },
  });

  // Fetch user progress
  const { data: progress = [] } = useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      const response = await api.get("/skills/progress");
      return response.data;
    },
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["skill-stats"],
    queryFn: async () => {
      const response = await api.get("/skills/dashboard");
      return response.data;
    },
  });

  // Get roadmap for selected domain
  const currentRoadmap = roadmaps.find((r) => r.domain === selectedDomain);

  // Get user progress for selected domain
  const domainProgress = progress.find((p) => p.domain === selectedDomain);

  // Get completed steps
  const completedSteps = domainProgress?.completedSteps?.map((s) => s.stepNumber) || [];

  // Mutations
  const completeStepMutation = useMutation({
    mutationFn: async ({ domain, stepNumber }) => {
      const response = await api.post("/skills/progress/complete-step", {
        domain,
        stepNumber,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["progress"]);
      queryClient.invalidateQueries(["skill-stats"]);
      toast.success("Step marked as completed!");
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async ({ quizId, answers }) => {
      const response = await api.post(`/skills/quizzes/${quizId}/attempt`, {
        answers,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["progress"]);
      queryClient.invalidateQueries(["skill-stats"]);
      if (data.passed) {
        toast.success(`Quiz passed! Score: ${data.score}%`);
      } else {
        toast.error(`Quiz failed. Score: ${data.score}%`);
      }
      setShowQuiz(null);
      setQuizAnswers({});
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData) => {
      const response = await api.post("/skills/projects", projectData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["skill-stats"]);
      toast.success("Project created successfully!");
      setShowProjectDialog(false);
      setProjectForm({
        title: "",
        description: "",
        domain: "Web Development",
        status: "planned",
        githubUrl: "",
        liveUrl: "",
        tags: "",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/skills/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["skill-stats"]);
      toast.success("Project updated successfully!");
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/skills/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["skill-stats"]);
      toast.success("Project deleted successfully!");
    },
  });

  const handleStartQuiz = async (step) => {
    try {
      const encodedDomain = encodeURIComponent(selectedDomain);
      const response = await api.get(
        `/skills/quizzes/${encodedDomain}/${step.stepNumber}`
      );
      setShowQuiz(response.data);
      setQuizAnswers({});
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Quiz not available for this step");
      } else {
        toast.error("Failed to load quiz");
      }
    }
  };

  const handleSubmitQuiz = () => {
    if (!showQuiz) return;
    
    // Validate all questions are answered
    const unanswered = showQuiz.questions.findIndex((_, index) => quizAnswers[index] === undefined || quizAnswers[index] === null);
    if (unanswered !== -1) {
      toast.error(`Please answer question ${unanswered + 1}`);
      return;
    }
    
    const answers = showQuiz.questions.map((_, index) => quizAnswers[index]);
    submitQuizMutation.mutate({
      quizId: showQuiz._id,
      answers,
    });
  };

  const handleCreateProject = () => {
    if (!projectForm.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    if (!projectForm.description.trim()) {
      toast.error("Project description is required");
      return;
    }
    const tags = projectForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    createProjectMutation.mutate({
      ...projectForm,
      tags,
    });
  };

  const calculateProgress = () => {
    if (!currentRoadmap) return 0;
    return Math.round((completedSteps.length / currentRoadmap.steps.length) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <RevealOnScroll direction="up" delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Domain-Specific Skill Development
          </h1>
          <p className="text-muted-foreground mt-2">
            Interactive learning paths, resources, quizzes, and projects to build your skills
          </p>
        </div>
      </RevealOnScroll>

      {/* Stats Cards */}
      <RevealOnScroll direction="up" delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Skills</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeSkills || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalSkills || 0} total skills
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedProjects || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalProjects || 0} total projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Passed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.passedQuizzes || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalQuizzes || 0} total attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domains</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.domains?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Learning domains</p>
            </CardContent>
          </Card>
        </div>
      </RevealOnScroll>

      {/* Main Content Tabs */}
      <Tabs defaultValue="roadmaps" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roadmaps">Skill Roadmaps</TabsTrigger>
          <TabsTrigger value="projects">Projects & Showcase</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
        </TabsList>

        {/* Skill Roadmaps Tab */}
        <TabsContent value="roadmaps" className="space-y-6">
          {/* Domain Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Learning Domain</CardTitle>
              <CardDescription>Choose a domain to view its learning roadmap</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Roadmap */}
          {currentRoadmap ? (
            <Card>
              <CardHeader>
                <CardTitle>{currentRoadmap.title}</CardTitle>
                <CardDescription>{currentRoadmap.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {calculateProgress()}%
                    </span>
                  </div>
                  <Progress value={calculateProgress()} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentRoadmap.steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.stepNumber);
                  const isCurrent = !isCompleted && index === completedSteps.length;

                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-4 border rounded-lg ${
                        isCompleted
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : isCurrent
                          ? "bg-primary/5 border-primary"
                          : "bg-card border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div
                            className={`mt-1 ${
                              isCompleted ? "text-green-600" : "text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : (
                              <Circle className="h-6 w-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                Step {step.stepNumber}: {step.title}
                              </h3>
                              {isCompleted && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Completed
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3">{step.description}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                              <span>⏱️ {step.estimatedTime}</span>
                            </div>

                            {/* Resources */}
                            {step.resources && step.resources.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium">Learning Resources:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {step.resources.map((resource, idx) => (
                                    <a
                                      key={idx}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2 p-2 border rounded hover:bg-accent transition-colors"
                                    >
                                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {resource.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {resource.description}
                                        </p>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quiz Button - Always show, backend will handle if quiz doesn't exist */}
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartQuiz(step)}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Take Quiz
                              </Button>
                            </div>
                          </div>
                        </div>
                        {!isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              completeStepMutation.mutate({
                                domain: selectedDomain,
                                stepNumber: step.stepNumber,
                              })
                            }
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Roadmap not available for {selectedDomain} yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Projects & Showcase Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Mini Projects & Showcase</h2>
              <p className="text-muted-foreground">
                Build hands-on projects to expand your portfolio
              </p>
            </div>
            <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Add a new project to track your learning progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-title">Title</Label>
                    <Input
                      id="project-title"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, title: e.target.value })
                      }
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, description: e.target.value })
                      }
                      placeholder="Describe your project"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-domain">Domain</Label>
                    <Select
                      value={projectForm.domain}
                      onValueChange={(value) =>
                        setProjectForm({ ...projectForm, domain: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DOMAINS.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project-status">Status</Label>
                    <Select
                      value={projectForm.status}
                      onValueChange={(value) =>
                        setProjectForm({ ...projectForm, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project-github">GitHub URL (optional)</Label>
                    <Input
                      id="project-github"
                      value={projectForm.githubUrl}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-live">Live URL (optional)</Label>
                    <Input
                      id="project-live"
                      value={projectForm.liveUrl}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, liveUrl: e.target.value })
                      }
                      placeholder="https://your-project.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-tags">Tags (comma-separated)</Label>
                    <Input
                      id="project-tags"
                      value={projectForm.tags}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, tags: e.target.value })
                      }
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowProjectDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject}>Create Project</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No projects yet. Create your first project to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.domain}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          project.status === "completed"
                            ? "default"
                            : project.status === "in-progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Globe className="h-4 w-4" />
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newStatus =
                            project.status === "planned"
                              ? "in-progress"
                              : project.status === "in-progress"
                              ? "completed"
                              : "completed";
                          updateProjectMutation.mutate({
                            id: project._id,
                            status: newStatus,
                          });
                        }}
                      >
                        {project.status === "completed"
                          ? "Completed"
                          : project.status === "in-progress"
                          ? "Mark Complete"
                          : "Start Project"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProjectMutation.mutate(project._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Progress Tracker Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Learning Progress Dashboard</h2>
            <p className="text-muted-foreground">
              Track your completion and learning insights across all domains
            </p>
          </div>

          {progress.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No progress tracked yet. Start a roadmap to begin tracking!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {progress.map((prog) => {
                const roadmap = roadmaps.find((r) => r.domain === prog.domain);
                const totalSteps = roadmap?.steps.length || 0;
                const completedCount = prog.completedSteps?.length || 0;
                const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

                return (
                  <Card key={prog._id}>
                    <CardHeader>
                      <CardTitle>{prog.domain}</CardTitle>
                      <CardDescription>
                        {completedCount} of {totalSteps} steps completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(progressPercent)}%
                          </span>
                        </div>
                        <Progress value={progressPercent} />
                      </div>

                      {prog.quizAttempts && prog.quizAttempts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Quiz Results</h4>
                          <div className="space-y-2">
                            {prog.quizAttempts.map((attempt, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 border rounded"
                              >
                                <span className="text-sm">Quiz Attempt {idx + 1}</span>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`text-sm font-medium ${
                                      attempt.passed
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {attempt.score}%
                                  </span>
                                  <Badge
                                    variant={attempt.passed ? "default" : "destructive"}
                                    className="text-xs"
                                  >
                                    {attempt.passed ? "Passed" : "Failed"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Last activity: {new Date(prog.lastActivity).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quiz Dialog */}
      {showQuiz && (
        <Dialog open={!!showQuiz} onOpenChange={() => setShowQuiz(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{showQuiz.title}</DialogTitle>
              <DialogDescription>{showQuiz.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {showQuiz.questions.map((question, qIdx) => (
                <div key={qIdx} className="space-y-3">
                  <h4 className="font-medium">
                    {qIdx + 1}. {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, oIdx) => (
                      <label
                        key={oIdx}
                        className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-accent"
                      >
                        <input
                          type="radio"
                          name={`question-${qIdx}`}
                          value={oIdx}
                          checked={quizAnswers[qIdx] === oIdx}
                          onChange={() =>
                            setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })
                          }
                          className="cursor-pointer"
                        />
                        <span className="flex-1">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowQuiz(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={
                    Object.keys(quizAnswers).length !== showQuiz.questions.length ||
                    submitQuizMutation.isLoading
                  }
                >
                  Submit Quiz
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

