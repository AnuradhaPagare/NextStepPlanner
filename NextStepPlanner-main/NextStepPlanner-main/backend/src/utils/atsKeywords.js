const ENGINEERING_DATA = {
  cse: {
    name: "Computer Science & Engineering",
    description: "Software development and computer systems",
    jobRoles: {
      softwareDeveloper: {
        name: "Software Developer",
        keywords: [
          "Java",
          "Python",
          "C++",
          "JavaScript",
          "React",
          "Node.js",
          "Git",
          "SQL",
          "Spring Boot",
          "MongoDB",
        ],
      },
      dataScientist: {
        name: "Data Scientist",
        keywords: [
          "Machine Learning",
          "Python",
          "Pandas",
          "TensorFlow",
          "Statistics",
          "NumPy",
          "R",
          "SQL",
          "Tableau",
          "Jupyter",
        ],
      },
      webDeveloper: {
        name: "Web Developer",
        keywords: [
          "HTML",
          "CSS",
          "JavaScript",
          "React",
          "Node.js",
          "Vue.js",
          "Angular",
          "TypeScript",
          "Bootstrap",
          "Express",
        ],
      },
    },
  },
  it: {
    name: "Information Technology",
    description: "IT systems and infrastructure management",
    jobRoles: {
      systemAdministrator: {
        name: "System Administrator",
        keywords: [
          "Linux",
          "Windows Server",
          "Networking",
          "Active Directory",
          "VMware",
          "PowerShell",
          "Bash",
          "DNS",
          "DHCP",
          "Virtualization",
        ],
      },
      cloudEngineer: {
        name: "Cloud Engineer",
        keywords: [
          "AWS",
          "Azure",
          "Google Cloud",
          "Kubernetes",
          "Docker",
          "Terraform",
          "Cloud Security",
          "Lambda",
          "S3",
          "EC2",
        ],
      },
    },
  },
};

const COMMON_KEYWORDS = {
  softSkills: [
    "Problem Solving",
    "Team Leadership",
    "Communication",
    "Project Management",
    "Critical Thinking",
    "Analytical Skills",
    "Time Management",
    "Adaptability",
  ],
  certifications: [
    "AWS Certified",
    "Azure Certified",
    "Google Cloud Certified",
    "PMP",
    "Certified Scrum Master",
    "CISSP",
    "CompTIA Security+",
    "CCNA",
  ],
};

const getKeywordsForRole = (branchId, jobRoleId) => {
  const branch = ENGINEERING_DATA[branchId];
  if (!branch) return [];

  if (jobRoleId && branch.jobRoles[jobRoleId]) {
    return [
      ...branch.jobRoles[jobRoleId].keywords,
      ...COMMON_KEYWORDS.softSkills,
      ...COMMON_KEYWORDS.certifications,
    ];
  } else {
    const allRoleKeywords = Object.values(branch.jobRoles).flatMap(
      (role) => role.keywords
    );

    return [
      ...new Set(allRoleKeywords),
      ...COMMON_KEYWORDS.softSkills,
      ...COMMON_KEYWORDS.certifications,
    ];
  }
};

const getBranches = () => {
  return Object.keys(ENGINEERING_DATA).map((key) => ({
    id: key,
    name: ENGINEERING_DATA[key].name,
    description: ENGINEERING_DATA[key].description,
  }));
};

const getJobRolesForBranch = (branchId) => {
  const branch = ENGINEERING_DATA[branchId];
  if (!branch) return [];

  return Object.keys(branch.jobRoles).map((key) => ({
    id: key,
    name: branch.jobRoles[key].name,
  }));
};

module.exports = {
  ENGINEERING_DATA,
  COMMON_KEYWORDS,
  getKeywordsForRole,
  getBranches,
  getJobRolesForBranch,
};
