import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { ButtonLoader, SectionLoader } from "../../components/ui/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import api from "../../api/axios";

// Comprehensive Engineering Branches → Job Roles → Keywords Dataset
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
          "Data Structures",
          "Algorithms",
          "OOP",
          "Git",
          "REST APIs",
          "SQL",
          "Spring Boot",
          "Hibernate",
          "JUnit",
          "Maven",
          "Design Patterns",
          "Code Review",
          "Version Control",
          "Agile",
          "Scrum",
          "SOLID Principles",
          "Microservices",
        ],
      },
      dataScientist: {
        name: "Data Scientist",
        keywords: [
          "Machine Learning",
          "Python",
          "Pandas",
          "Scikit-learn",
          "TensorFlow",
          "Statistics",
          "Data Visualization",
          "NumPy",
          "Jupyter",
          "R",
          "SQL",
          "Tableau",
          "Power BI",
          "Apache Spark",
          "Big Data",
          "Predictive Analytics",
          "Deep Learning",
          "Feature Engineering",
          "A/B Testing",
          "Statistical Modeling",
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
          "MongoDB",
          "Express",
          "Vue.js",
          "Angular",
          "TypeScript",
          "Webpack",
          "Bootstrap",
          "SASS",
          "GraphQL",
          "Redux",
          "Next.js",
          "Responsive Design",
          "Cross-browser Compatibility",
          "Web Performance",
          "PWA",
        ],
      },
      aimlEngineer: {
        name: "AI/ML Engineer",
        keywords: [
          "Neural Networks",
          "PyTorch",
          "Deep Learning",
          "NLP",
          "Computer Vision",
          "Reinforcement Learning",
          "Keras",
          "OpenCV",
          "LSTM",
          "CNN",
          "RNN",
          "Transfer Learning",
          "Model Deployment",
          "MLOps",
          "Feature Selection",
          "Hyperparameter Tuning",
          "Ensemble Methods",
          "Time Series Analysis",
          "Recommendation Systems",
          "AutoML",
        ],
      },
      devopsEngineer: {
        name: "DevOps Engineer",
        keywords: [
          "CI/CD",
          "Docker",
          "Kubernetes",
          "AWS",
          "Jenkins",
          "Terraform",
          "Cloud Computing",
          "Ansible",
          "Git",
          "Linux",
          "Shell Scripting",
          "Monitoring",
          "Logging",
          "Infrastructure as Code",
          "Azure",
          "GCP",
          "Helm",
          "Prometheus",
          "Grafana",
          "ELK Stack",
        ],
      },
      cybersecurityAnalyst: {
        name: "Cybersecurity Analyst",
        keywords: [
          "Network Security",
          "Cryptography",
          "Ethical Hacking",
          "Kali Linux",
          "Firewalls",
          "SIEM",
          "Threat Analysis",
          "Penetration Testing",
          "Vulnerability Assessment",
          "Incident Response",
          "Malware Analysis",
          "Security Auditing",
          "Risk Assessment",
          "Compliance",
          "ISO 27001",
          "NIST",
          "OWASP",
          "Forensics",
          "Identity Management",
          "Zero Trust",
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
          "Cloud Infrastructure",
          "PowerShell",
          "Bash",
          "DNS",
          "DHCP",
          "Group Policy",
          "Backup Solutions",
          "Server Maintenance",
          "Virtualization",
          "Hyper-V",
          "System Monitoring",
          "Patch Management",
          "Network Troubleshooting",
          "RAID",
          "Storage Management",
        ],
      },
      databaseAdministrator: {
        name: "Database Administrator",
        keywords: [
          "SQL",
          "MySQL",
          "PostgreSQL",
          "Oracle",
          "Indexing",
          "Query Optimization",
          "Backup & Recovery",
          "Performance Tuning",
          "Database Security",
          "Replication",
          "Clustering",
          "Data Modeling",
          "ETL",
          "Data Warehousing",
          "MongoDB",
          "NoSQL",
          "Database Migration",
          "ACID Properties",
          "Stored Procedures",
          "Database Design",
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
          "Cloud Migration",
          "Serverless",
          "Auto Scaling",
          "Load Balancing",
          "CDN",
          "Cloud Monitoring",
          "Cost Optimization",
          "Multi-cloud",
          "Hybrid Cloud",
          "Cloud Architecture",
        ],
      },
      itSupportSpecialist: {
        name: "IT Support Specialist",
        keywords: [
          "Troubleshooting",
          "Networking",
          "OS Support",
          "ITIL",
          "Ticketing Systems",
          "Hardware Support",
          "Help Desk",
          "Remote Support",
          "Windows",
          "MacOS",
          "Mobile Device Management",
          "User Training",
          "Technical Documentation",
          "Asset Management",
          "Software Installation",
          "Network Configuration",
          "VPN",
          "Printer Support",
          "Email Support",
          "Customer Service",
        ],
      },
      businessAnalyst: {
        name: "Business Analyst",
        keywords: [
          "Requirement Gathering",
          "Agile",
          "Scrum",
          "SQL",
          "Documentation",
          "JIRA",
          "Stakeholder Management",
          "Process Mapping",
          "User Stories",
          "Wireframing",
          "Gap Analysis",
          "Business Process",
          "Data Analysis",
          "Reporting",
          "Project Management",
          "Risk Analysis",
          "Change Management",
          "Quality Assurance",
          "Testing",
          "Confluence",
        ],
      },
    },
  },
  ece: {
    name: "Electronics & Communication Engineering",
    description: "Electronic circuits and communication systems",
    jobRoles: {
      embeddedSystemsEngineer: {
        name: "Embedded Systems Engineer",
        keywords: [
          "Microcontrollers",
          "C",
          "C++",
          "RTOS",
          "ARM",
          "Firmware",
          "UART",
          "SPI",
          "I2C",
          "ADC",
          "PWM",
          "Interrupts",
          "Memory Management",
          "Debugging",
          "Oscilloscope",
          "Logic Analyzer",
          "PCB Design",
          "Schematic Design",
          "Hardware Abstraction",
          "Device Drivers",
        ],
      },
      vlsiDesignEngineer: {
        name: "VLSI Design Engineer",
        keywords: [
          "Verilog",
          "VHDL",
          "ASIC",
          "FPGA",
          "Cadence",
          "Synopsys",
          "RTL Design",
          "Logic Synthesis",
          "Physical Design",
          "Timing Analysis",
          "Power Analysis",
          "DFT",
          "Verification",
          "SystemVerilog",
          "UVM",
          "Place & Route",
          "Clock Tree Synthesis",
          "Static Timing Analysis",
          "Layout Design",
          "Mask Design",
        ],
      },
      networkEngineer: {
        name: "Network Engineer",
        keywords: [
          "TCP/IP",
          "Routing",
          "Switching",
          "CCNA",
          "Firewalls",
          "VPN",
          "Network Troubleshooting",
          "OSPF",
          "BGP",
          "VLAN",
          "QoS",
          "Network Security",
          "Wireshark",
          "Cisco",
          "Juniper",
          "Network Design",
          "LAN",
          "WAN",
          "Wireless",
          "Network Monitoring",
        ],
      },
      signalProcessingEngineer: {
        name: "Signal Processing Engineer",
        keywords: [
          "MATLAB",
          "DSP",
          "Fourier Transform",
          "Filters",
          "Wireless Communication",
          "Simulink",
          "Digital Filters",
          "Analog Filters",
          "Modulation",
          "Demodulation",
          "Signal Analysis",
          "Spectrum Analysis",
          "Image Processing",
          "Audio Processing",
          "Communication Systems",
          "RF Design",
          "Antenna Design",
          "Channel Coding",
          "Error Correction",
          "Software Defined Radio",
        ],
      },
      iotEngineer: {
        name: "IoT Engineer",
        keywords: [
          "MQTT",
          "Raspberry Pi",
          "Arduino",
          "Cloud IoT",
          "Sensor Integration",
          "Edge Computing",
          "LoRaWAN",
          "Zigbee",
          "WiFi",
          "Bluetooth",
          "6LoWPAN",
          "CoAP",
          "RESTful APIs",
          "Time Series Databases",
          "Data Analytics",
          "Machine Learning",
          "Firmware Development",
          "Protocol Stacks",
          "Security",
          "Device Management",
        ],
      },
    },
  },
  ee: {
    name: "Electrical Engineering",
    description: "Electrical power and control systems",
    jobRoles: {
      powerSystemsEngineer: {
        name: "Power Systems Engineer",
        keywords: [
          "Transmission",
          "Distribution",
          "Grid",
          "SCADA",
          "Power Electronics",
          "Renewable Energy",
          "Load Flow",
          "Fault Analysis",
          "Protection Systems",
          "Transformers",
          "Generators",
          "Motors",
          "Power Quality",
          "Smart Grid",
          "HVDC",
          "Reactive Power",
          "Power Factor",
          "Substation Design",
          "Relay Protection",
          "Energy Management",
        ],
      },
      controlSystemsEngineer: {
        name: "Control Systems Engineer",
        keywords: [
          "PID Control",
          "PLC",
          "SCADA",
          "Automation",
          "MATLAB",
          "Simulink",
          "Control Theory",
          "Feedback Systems",
          "Process Control",
          "Industrial Automation",
          "HMI",
          "DCS",
          "Instrumentation",
          "Sensors",
          "Actuators",
          "Motor Control",
          "Variable Frequency Drives",
          "System Identification",
          "Robust Control",
          "Adaptive Control",
        ],
      },
      electricalDesignEngineer: {
        name: "Electrical Design Engineer",
        keywords: [
          "Circuit Design",
          "AutoCAD Electrical",
          "Protection Systems",
          "Switchgear",
          "Electrical Safety",
          "NEC",
          "IEC Standards",
          "Panel Design",
          "Motor Control Centers",
          "Cable Sizing",
          "Load Calculations",
          "Short Circuit Analysis",
          "Arc Flash Analysis",
          "Grounding Systems",
          "Lightning Protection",
          "Power Distribution",
          "Electrical Drawings",
          "Specifications",
          "Cost Estimation",
          "Project Management",
        ],
      },
      maintenanceEngineer: {
        name: "Maintenance Engineer",
        keywords: [
          "Electrical Safety",
          "Troubleshooting",
          "Preventive Maintenance",
          "Motors",
          "Transformers",
          "Predictive Maintenance",
          "Condition Monitoring",
          "Vibration Analysis",
          "Thermography",
          "Oil Analysis",
          "Motor Testing",
          "Insulation Testing",
          "Power Quality Analysis",
          "Root Cause Analysis",
          "Maintenance Planning",
          "CMMS",
          "Reliability Engineering",
          "Asset Management",
          "Safety Procedures",
          "Lock Out Tag Out",
        ],
      },
    },
  },
  me: {
    name: "Mechanical Engineering",
    description: "Mechanical systems and manufacturing",
    jobRoles: {
      designEngineer: {
        name: "Design Engineer",
        keywords: [
          "CAD",
          "SolidWorks",
          "CATIA",
          "GD&T",
          "FEA",
          "Product Design",
          "AutoCAD",
          "Inventor",
          "NX",
          "Creo",
          "3D Modeling",
          "Assembly Design",
          "Drafting",
          "Tolerance Analysis",
          "Material Selection",
          "Design for Manufacturing",
          "Design for Assembly",
          "Rapid Prototyping",
          "3D Printing",
          "Design Optimization",
        ],
      },
      automobileEngineer: {
        name: "Automobile Engineer",
        keywords: [
          "Vehicle Dynamics",
          "Engines",
          "EV Technology",
          "MATLAB",
          "Automotive CAD",
          "Powertrain",
          "Suspension",
          "Braking Systems",
          "Steering Systems",
          "Transmission",
          "Hybrid Vehicles",
          "Battery Management",
          "Automotive Electronics",
          "Crash Analysis",
          "NVH",
          "Aerodynamics",
          "Vehicle Testing",
          "Automotive Standards",
          "ADAS",
          "Autonomous Vehicles",
        ],
      },
      thermalEngineer: {
        name: "Thermal Engineer",
        keywords: [
          "Thermodynamics",
          "CFD",
          "Heat Transfer",
          "ANSYS Fluent",
          "Combustion",
          "Heat Exchangers",
          "HVAC",
          "Thermal Analysis",
          "Cooling Systems",
          "Thermal Management",
          "Conduction",
          "Convection",
          "Radiation",
          "Phase Change",
          "Energy Systems",
          "Thermal Modeling",
          "Temperature Control",
          "Insulation",
          "Thermal Design",
          "Energy Efficiency",
        ],
      },
      productionEngineer: {
        name: "Production Engineer",
        keywords: [
          "Lean Manufacturing",
          "Six Sigma",
          "CNC",
          "Robotics",
          "Industrial Safety",
          "Manufacturing Processes",
          "Quality Control",
          "Process Optimization",
          "Automation",
          "Production Planning",
          "Supply Chain",
          "Inventory Management",
          "Cost Reduction",
          "Efficiency Improvement",
          "Kaizen",
          "5S",
          "Poka-Yoke",
          "Statistical Process Control",
          "Root Cause Analysis",
          "Continuous Improvement",
        ],
      },
      maintenanceEngineerMech: {
        name: "Maintenance Engineer",
        keywords: [
          "Mechanical Systems",
          "Predictive Maintenance",
          "Reliability Engineering",
          "Vibration Analysis",
          "Alignment",
          "Balancing",
          "Bearing Analysis",
          "Lubrication",
          "Pump Maintenance",
          "Compressor Maintenance",
          "Conveyor Systems",
          "Hydraulics",
          "Pneumatics",
          "Maintenance Planning",
          "CMMS",
          "Condition Monitoring",
          "Failure Analysis",
          "Spare Parts Management",
          "Safety Procedures",
          "Maintenance Optimization",
        ],
      },
    },
  },
  ce: {
    name: "Civil Engineering",
    description: "Construction and infrastructure development",
    jobRoles: {
      structuralEngineer: {
        name: "Structural Engineer",
        keywords: [
          "RCC",
          "STAAD Pro",
          "AutoCAD",
          "Seismic Design",
          "FEM",
          "Load Analysis",
          "Steel Structures",
          "Concrete Design",
          "Foundation Design",
          "Building Codes",
          "Structural Analysis",
          "ETABS",
          "SAP2000",
          "Tekla",
          "Revit",
          "BIM",
          "Wind Load",
          "Earthquake Engineering",
          "Bridge Design",
          "High-rise Buildings",
        ],
      },
      constructionEngineer: {
        name: "Construction Engineer",
        keywords: [
          "Project Management",
          "Primavera",
          "AutoCAD",
          "Scheduling",
          "Estimation",
          "Construction Planning",
          "Site Management",
          "Quality Control",
          "Safety Management",
          "Resource Planning",
          "Cost Control",
          "Contract Management",
          "Material Management",
          "Equipment Management",
          "Progress Monitoring",
          "Risk Management",
          "Lean Construction",
          "Building Information Modeling",
          "Construction Technology",
          "Green Building",
        ],
      },
      geotechnicalEngineer: {
        name: "Geotechnical Engineer",
        keywords: [
          "Soil Mechanics",
          "Foundation Engineering",
          "Geo-Analysis",
          "FEM",
          "Slope Stability",
          "Earth Retaining Structures",
          "Deep Foundations",
          "Shallow Foundations",
          "Site Investigation",
          "Soil Testing",
          "Rock Mechanics",
          "Groundwater",
          "Consolidation",
          "Shear Strength",
          "Bearing Capacity",
          "Settlement Analysis",
          "Liquefaction",
          "Geosynthetics",
          "Ground Improvement",
          "Tunneling",
        ],
      },
      transportationEngineer: {
        name: "Transportation Engineer",
        keywords: [
          "Traffic Engineering",
          "Pavement Design",
          "Highway Engineering",
          "Transportation Planning",
          "Traffic Signal Design",
          "Intersection Design",
          "Road Safety",
          "Traffic Flow",
          "Capacity Analysis",
          "Public Transportation",
          "Transit Systems",
          "Traffic Simulation",
          "Intelligent Transportation Systems",
          "Pavement Materials",
          "Asphalt",
          "Concrete Pavement",
          "Traffic Management",
          "Urban Planning",
          "Environmental Impact",
          "Sustainable Transportation",
        ],
      },
      environmentalEngineer: {
        name: "Environmental Engineer",
        keywords: [
          "Wastewater Treatment",
          "Air Pollution Control",
          "Sustainability",
          "Water Treatment",
          "Solid Waste Management",
          "Environmental Impact Assessment",
          "Pollution Prevention",
          "Environmental Monitoring",
          "Remediation",
          "Green Technology",
          "Carbon Footprint",
          "Life Cycle Assessment",
          "Environmental Compliance",
          "Water Quality",
          "Air Quality",
          "Soil Contamination",
          "Environmental Modeling",
          "Renewable Energy",
          "Climate Change",
          "Environmental Management Systems",
        ],
      },
    },
  },
  che: {
    name: "Chemical Engineering",
    description: "Chemical processes and materials",
    jobRoles: {
      processEngineer: {
        name: "Process Engineer",
        keywords: [
          "Process Design",
          "PFD",
          "P&ID",
          "Aspen HYSYS",
          "Safety Engineering",
          "Unit Operations",
          "Mass Transfer",
          "Heat Transfer",
          "Reaction Engineering",
          "Distillation",
          "Absorption",
          "Extraction",
          "Crystallization",
          "Process Optimization",
          "Process Control",
          "Instrumentation",
          "Process Safety",
          "HAZOP",
          "Risk Assessment",
          "Simulation",
        ],
      },
      petrochemicalEngineer: {
        name: "Petrochemical Engineer",
        keywords: [
          "Oil & Gas",
          "Refinery",
          "Catalysis",
          "Hydrocarbon Processing",
          "Crude Oil",
          "Natural Gas",
          "Petrochemicals",
          "Process Units",
          "Fractionation",
          "Reforming",
          "Cracking",
          "Hydrotreating",
          "Process Optimization",
          "Energy Integration",
          "Corrosion",
          "Materials",
          "Pipeline",
          "Storage",
          "Environmental Compliance",
          "Process Economics",
        ],
      },
      biochemicalEngineer: {
        name: "Biochemical Engineer",
        keywords: [
          "Bioprocessing",
          "Fermentation",
          "Enzyme Engineering",
          "Biotechnology",
          "Bioreactor Design",
          "Cell Culture",
          "Downstream Processing",
          "Purification",
          "Chromatography",
          "Filtration",
          "Microbiology",
          "Bioprocess Control",
          "Scale-up",
          "Validation",
          "GMP",
          "FDA Regulations",
          "Bioprocess Optimization",
          "Metabolic Engineering",
          "Protein Production",
          "Vaccine Production",
        ],
      },
      safetyEngineer: {
        name: "Safety Engineer",
        keywords: [
          "HAZOP",
          "Process Safety",
          "Risk Analysis",
          "OSHA Standards",
          "Safety Management Systems",
          "Incident Investigation",
          "Safety Training",
          "Emergency Response",
          "Fire Safety",
          "Explosion Prevention",
          "Toxic Release",
          "Safety Instrumented Systems",
          "Layer of Protection Analysis",
          "Quantitative Risk Assessment",
          "Safety Culture",
          "Regulatory Compliance",
          "Safety Auditing",
          "Occupational Health",
          "Environmental Safety",
          "Safety Design",
        ],
      },
    },
  },
  bme: {
    name: "Biomedical Engineering",
    description: "Medical devices and healthcare technology",
    jobRoles: {
      medicalDeviceEngineer: {
        name: "Medical Device Engineer",
        keywords: [
          "Biomaterials",
          "FDA Regulations",
          "CAD",
          "Sensors",
          "Electronics in Healthcare",
          "Medical Device Design",
          "Biocompatibility",
          "Sterilization",
          "Quality Management",
          "ISO 13485",
          "Risk Management",
          "Clinical Trials",
          "Regulatory Affairs",
          "Device Testing",
          "Validation",
          "Verification",
          "Design Controls",
          "Usability Engineering",
          "Human Factors",
          "Medical Software",
        ],
      },
      rehabilitationEngineer: {
        name: "Rehabilitation Engineer",
        keywords: [
          "Prosthetics",
          "Robotics",
          "Biomechanics",
          "Assistive Devices",
          "Orthotics",
          "Mobility Aids",
          "Adaptive Technology",
          "Human Movement",
          "Gait Analysis",
          "Wheelchair Design",
          "Rehabilitation Robotics",
          "Neural Engineering",
          "Brain-Computer Interface",
          "Functional Electrical Stimulation",
          "Ergonomics",
          "Accessibility",
          "User-Centered Design",
          "3D Printing",
          "Custom Devices",
          "Therapy Equipment",
        ],
      },
      clinicalEngineer: {
        name: "Clinical Engineer",
        keywords: [
          "Hospital Equipment",
          "Maintenance",
          "Healthcare Standards",
          "Medical Regulations",
          "Equipment Management",
          "Safety Testing",
          "Calibration",
          "Preventive Maintenance",
          "Technology Assessment",
          "Staff Training",
          "Procurement",
          "Installation",
          "Commissioning",
          "Troubleshooting",
          "Repair",
          "Quality Assurance",
          "Risk Management",
          "Cost Management",
          "Technology Planning",
          "Vendor Management",
        ],
      },
      researchScientist: {
        name: "Research Scientist",
        keywords: [
          "Biomedical Imaging",
          "Biosensors",
          "Microfluidics",
          "Medical Research",
          "Clinical Research",
          "Data Analysis",
          "Statistical Analysis",
          "Laboratory Techniques",
          "Research Methodology",
          "Grant Writing",
          "Publication",
          "Collaboration",
          "Innovation",
          "Technology Transfer",
          "Intellectual Property",
          "Regulatory Science",
          "Translational Research",
          "Preclinical Studies",
          "Clinical Studies",
          "Evidence-Based Medicine",
        ],
      },
    },
  },
  ae: {
    name: "Aerospace Engineering",
    description: "Aircraft and spacecraft systems",
    jobRoles: {
      aerospaceDesignEngineer: {
        name: "Aerospace Design Engineer",
        keywords: [
          "Aerodynamics",
          "CATIA",
          "SolidWorks",
          "CFD",
          "Propulsion",
          "Aircraft Design",
          "Spacecraft Design",
          "Wind Tunnel Testing",
          "Flight Mechanics",
          "Structural Analysis",
          "Materials",
          "Composites",
          "Finite Element Analysis",
          "CAD Modeling",
          "Design Optimization",
          "Performance Analysis",
          "Weight Analysis",
          "Systems Integration",
          "Manufacturing",
          "Testing",
        ],
      },
      flightSystemsEngineer: {
        name: "Flight Systems Engineer",
        keywords: [
          "Control Systems",
          "Avionics",
          "Navigation",
          "Simulation",
          "Flight Control",
          "Autopilot",
          "Guidance Systems",
          "Flight Testing",
          "Systems Engineering",
          "Requirements",
          "Verification",
          "Validation",
          "Integration",
          "MATLAB",
          "Simulink",
          "Flight Dynamics",
          "Stability",
          "Performance",
          "Safety Systems",
          "Software",
        ],
      },
      propulsionEngineer: {
        name: "Propulsion Engineer",
        keywords: [
          "Jet Engines",
          "Rocket Propulsion",
          "Thermodynamics",
          "CFD",
          "Combustion",
          "Turbomachinery",
          "Gas Turbines",
          "Propellants",
          "Nozzle Design",
          "Engine Testing",
          "Performance Analysis",
          "Fuel Systems",
          "Engine Controls",
          "Materials",
          "Heat Transfer",
          "Fluid Mechanics",
          "Engine Cycles",
          "Efficiency",
          "Emissions",
          "Maintenance",
        ],
      },
      structuralEngineerAero: {
        name: "Structural Engineer (Aerospace)",
        keywords: [
          "Composite Materials",
          "FEM",
          "ANSYS",
          "Load Analysis",
          "Fatigue Analysis",
          "Fracture Mechanics",
          "Stress Analysis",
          "Vibration Analysis",
          "Modal Analysis",
          "Structural Testing",
          "Materials Testing",
          "Certification",
          "Airworthiness",
          "Design Standards",
          "Weight Optimization",
          "Manufacturing Processes",
          "Quality Control",
          "Inspection",
          "Repair",
          "Maintenance",
        ],
      },
    },
  },
  ipe: {
    name: "Industrial & Production Engineering",
    description: "Manufacturing and operations optimization",
    jobRoles: {
      operationsManager: {
        name: "Operations Manager",
        keywords: [
          "Lean Manufacturing",
          "Supply Chain",
          "ERP",
          "Logistics",
          "Operations Management",
          "Process Improvement",
          "Capacity Planning",
          "Inventory Management",
          "Quality Management",
          "Cost Control",
          "Performance Metrics",
          "KPIs",
          "Team Management",
          "Project Management",
          "Strategic Planning",
          "Vendor Management",
          "Customer Service",
          "Risk Management",
          "Compliance",
          "Continuous Improvement",
        ],
      },
      qualityEngineer: {
        name: "Quality Engineer",
        keywords: [
          "Six Sigma",
          "SPC",
          "Quality Audits",
          "ISO Standards",
          "Quality Management",
          "Process Capability",
          "Statistical Analysis",
          "Control Charts",
          "Quality Planning",
          "Quality Control",
          "Quality Assurance",
          "Root Cause Analysis",
          "Corrective Actions",
          "Preventive Actions",
          "FMEA",
          "Design of Experiments",
          "Measurement Systems",
          "Calibration",
          "Training",
          "Documentation",
        ],
      },
      manufacturingEngineer: {
        name: "Manufacturing Engineer",
        keywords: [
          "CNC",
          "Robotics",
          "Process Optimization",
          "Manufacturing Processes",
          "Automation",
          "Assembly",
          "Machining",
          "Welding",
          "Forming",
          "Casting",
          "Injection Molding",
          "Quality Control",
          "Tooling",
          "Fixtures",
          "Work Instructions",
          "Time Studies",
          "Ergonomics",
          "Safety",
          "Cost Reduction",
          "Efficiency",
        ],
      },
      supplyChainAnalyst: {
        name: "Supply Chain Analyst",
        keywords: [
          "Logistics",
          "Inventory Management",
          "Forecasting",
          "SAP",
          "Demand Planning",
          "Supply Planning",
          "Procurement",
          "Vendor Management",
          "Transportation",
          "Warehousing",
          "Distribution",
          "Cost Analysis",
          "Performance Metrics",
          "Data Analysis",
          "ERP Systems",
          "Process Improvement",
          "Risk Management",
          "Sustainability",
          "Global Supply Chain",
          "E-commerce",
        ],
      },
    },
  },
};

export default function Resume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const queryClient = useQueryClient();

  const { data: resumeHistory = [] } = useQuery({
    queryKey: ["resume-history"],
    queryFn: async () => {
      const response = await api.get("/resume/history");
      return response.data;
    },
  });

  const { data: keywordsData = {} } = useQuery({
    queryKey: ["ats-keywords"],
    queryFn: async () => {
      try {
        const response = await api.get("/resume/keywords/list");
        return response.data;
      } catch (error) {
        console.warn(
          "Failed to fetch keywords from backend, using static data"
        );
        return ENGINEERING_DATA;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Get available branches
  const branches = Object.keys(ENGINEERING_DATA).map((key) => ({
    id: key,
    name: ENGINEERING_DATA[key].name,
    description: ENGINEERING_DATA[key].description,
  }));

  // Get available job roles based on selected branch
  const availableJobRoles =
    selectedBranch && ENGINEERING_DATA[selectedBranch]
      ? Object.keys(ENGINEERING_DATA[selectedBranch].jobRoles).map((key) => ({
          id: key,
          name: ENGINEERING_DATA[selectedBranch].jobRoles[key].name,
        }))
      : [];

  // Reset job role when branch changes
  useEffect(() => {
    if (selectedBranch) {
      setSelectedJobRole("");
    }
  }, [selectedBranch]);

  const uploadResumeMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["resume-history"]);
      toast.success("Resume analyzed successfully!");
      setSelectedFile(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to analyze resume");
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId) => {
      await api.delete(`/resume/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resume-history"]);
      toast.success("Resume analysis deleted!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete resume");
    },
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!selectedBranch) {
      toast.error("Please select your engineering branch");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("branch", selectedBranch);
    if (selectedJobRole) formData.append("jobRole", selectedJobRole);

    try {
      await uploadResumeMutation.mutateAsync(formData);
    } finally {
      setUploading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Resume ATS Analyzer
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload your resume to get an ATS (Applicant Tracking System) score and
          keyword analysis
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Resume</span>
          </CardTitle>
          <CardDescription>
            Upload a PDF file to analyze your resume's ATS compatibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-foreground">
                    {selectedFile
                      ? selectedFile.name
                      : "Select a PDF file to upload"}
                  </span>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF files only, up to 10MB
                </p>
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                onClick={() => setSelectedFile(null)}
                variant="ghost"
                size="sm"
              >
                Remove
              </Button>
            </div>
          )}

          {/* Branch and Job Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="branch-select"
                className="text-sm font-medium leading-none"
              >
                Engineering Branch <span className="text-red-500">*</span>
              </label>
              <select
                id="branch-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select your engineering branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {selectedBranch && (
                <p className="text-xs text-muted-foreground">
                  {branches.find((b) => b.id === selectedBranch)?.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="job-role-select"
                className="text-sm font-medium leading-none"
              >
                Target Job Role (Optional)
              </label>
              <select
                id="job-role-select"
                value={selectedJobRole}
                onChange={(e) => setSelectedJobRole(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selectedBranch}
              >
                <option value="">
                  {selectedBranch
                    ? "Select your target job role"
                    : "Select branch first"}
                </option>
                {availableJobRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {selectedBranch && !availableJobRoles.length && (
                <p className="text-xs text-yellow-600">
                  No job roles available for selected branch
                </p>
              )}
            </div>
          </div>

          {(selectedBranch || selectedJobRole) && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Smart Analysis Enabled
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your resume will be analyzed against specialized keywords
                    for{" "}
                    {selectedBranch && (
                      <span className="font-medium">
                        {branches.find((b) => b.id === selectedBranch)?.name}
                      </span>
                    )}
                    {selectedBranch && selectedJobRole && " → "}
                    {selectedJobRole && (
                      <span className="font-medium">
                        {
                          availableJobRoles.find(
                            (r) => r.id === selectedJobRole
                          )?.name
                        }
                      </span>
                    )}
                    {!selectedJobRole &&
                      selectedBranch &&
                      " (General Branch Keywords)"}
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <ButtonLoader text="Analyzing Resume..." />
            ) : (
              "Analyze Resume"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ATS Keywords Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Smart ATS Analysis</CardTitle>
          <CardDescription>
            Our enhanced system analyzes resumes based on your specific field
            and target role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Engineering Branches Available
              </h4>
              <div className="space-y-2 text-sm">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded"
                  >
                    <span className="font-medium">{branch.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {branch.id === "cse"
                        ? "50+"
                        : branch.id === "it"
                        ? "45+"
                        : "35+"}{" "}
                      keywords
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Job Roles (Cascading)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                    Dynamic Job Role Selection
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-xs">
                    Job roles will appear based on your selected engineering
                    branch. Each branch has 3-6 specialized job roles with
                    targeted keywords.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  🎯 How Smart Analysis Works
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    • <strong>Branch-Specific:</strong> Technical keywords
                    relevant to your engineering field
                  </p>
                  <p>
                    • <strong>Role-Targeted:</strong> Job-specific skills and
                    responsibilities
                  </p>
                  <p>
                    • <strong>Universal Skills:</strong> Soft skills and
                    industry certifications
                  </p>
                  <p>
                    • <strong>Smart Scoring:</strong> Weighted analysis based on
                    keyword importance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume History */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
          <CardDescription>Your previous resume analyses</CardDescription>
        </CardHeader>
        <CardContent>
          {resumeHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground mt-4">
                No resumes analyzed yet. Upload your first resume to get
                started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resumeHistory.map((resume) => (
                <div
                  key={resume._id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{resume.fileName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Analyzed on{" "}
                          {new Date(resume.uploadedAt).toLocaleDateString()}
                        </p>
                        {(resume.selectedBranch || resume.selectedJobRole) && (
                          <div className="flex items-center gap-2 mt-1">
                            {resume.selectedBranch && (
                              <Badge variant="secondary" className="text-xs">
                                {branches.find(
                                  (b) => b.id === resume.selectedBranch
                                )?.name || resume.selectedBranch}
                              </Badge>
                            )}
                            {resume.selectedJobRole &&
                              resume.selectedBranch && (
                                <Badge variant="secondary" className="text-xs">
                                  {ENGINEERING_DATA[resume.selectedBranch]
                                    ?.jobRoles?.[resume.selectedJobRole]
                                    ?.name || resume.selectedJobRole}
                                </Badge>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => deleteResumeMutation.mutate(resume._id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* ATS Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ATS Score</span>
                      <span
                        className={`text-lg font-bold ${getScoreColor(
                          resume.score
                        )}`}
                      >
                        {resume.score}% - {getScoreLabel(resume.score)}
                      </span>
                    </div>
                    <Progress value={resume.score} className="w-full" />
                  </div>

                  {/* Keywords Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Found Keywords */}
                    <div>
                      <h5 className="font-medium text-green-600 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Found Keywords ({resume.keywordsFound.length})
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {resume.keywordsFound.map((keyword) => (
                          <Badge
                            key={keyword}
                            className="bg-green-100 text-green-800"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div>
                      <h5 className="font-medium text-red-600 mb-2 flex items-center">
                        <XCircle className="h-4 w-4 mr-1" />
                        Missing Keywords ({resume.keywordsMissing.length})
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {resume.keywordsMissing.slice(0, 10).map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="outline"
                            className="text-red-600"
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {resume.keywordsMissing.length > 10 && (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            +{resume.keywordsMissing.length - 10} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {resume.score < 80 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h5 className="font-medium text-yellow-800 mb-1">
                        Recommendations to improve your ATS score:
                      </h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>
                          • Add missing keywords naturally throughout your
                          resume
                        </li>
                        <li>
                          • Use standard section headings (Experience,
                          Education, Skills)
                        </li>
                        <li>• Include relevant technical skills and tools</li>
                        <li>
                          • Quantify your achievements with numbers and metrics
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
