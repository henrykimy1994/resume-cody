export default class DataLoader {
    constructor() {
        this.cache = new Map();
    }

    async load(url) {
        // Check cache first
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Validate data structure
            this.validateData(data);
            
            // Cache the data
            this.cache.set(url, data);
            
            return data;
            
        } catch (error) {
            console.error('Error loading data:', error);
            
            // Return fallback data if fetch fails
            return this.getFallbackData();
        }
    }

    validateData(data) {
        const requiredFields = ['about', 'experience', 'projects', 'skills', 'contact'];
        
        requiredFields.forEach(field => {
            if (!data.hasOwnProperty(field)) {
                console.warn(`Missing required field: ${field}`);
            }
        });
        
        return true;
    }

    getFallbackData() {
        // Return default data structure if loading fails
        return {
            about: {
                description: "Innovative Traffic Systems Research Engineer with expertise in intelligent transportation systems, traffic flow optimization, and data-driven urban mobility solutions. Passionate about creating safer, more efficient transportation networks through advanced analytics and cutting-edge technology.",
                education: "Ph.D. in Transportation Engineering, MIT",
                location: "San Francisco, CA",
                specialization: "Intelligent Transportation Systems & Traffic Flow Optimization"
            },
            experience: [
                {
                    position: "Senior Traffic Systems Engineer",
                    company: "Urban Dynamics Lab",
                    period: "2021 - Present",
                    description: "Leading research on AI-powered traffic optimization systems, reducing congestion by 35% in pilot cities through adaptive signal control and predictive analytics."
                },
                {
                    position: "Research Scientist",
                    company: "Smart Cities Institute",
                    period: "2019 - 2021",
                    description: "Developed machine learning models for real-time traffic prediction and incident detection, improving emergency response times by 25%."
                },
                {
                    position: "Traffic Data Analyst",
                    company: "Metropolitan Transportation Authority",
                    period: "2017 - 2019",
                    description: "Analyzed traffic patterns using big data technologies, implemented optimization algorithms that improved traffic flow efficiency by 20%."
                },
                {
                    position: "Junior Transportation Engineer",
                    company: "Traffic Solutions Inc.",
                    period: "2016 - 2017",
                    description: "Designed and simulated traffic control systems for urban intersections, contributing to city-wide traffic management improvements."
                }
            ],
            projects: [
                {
                    title: "AI Traffic Signal Optimization",
                    description: "Developed an AI system that adapts traffic signals in real-time based on traffic flow, reducing wait times by 40% and emissions by 15%.",
                    icon: "brain",
                    tags: ["Machine Learning", "Python", "Computer Vision", "IoT"]
                },
                {
                    title: "Connected Vehicle Platform",
                    description: "Built a V2X communication platform enabling vehicles to communicate with infrastructure, improving safety and traffic efficiency.",
                    icon: "car",
                    tags: ["5G", "Edge Computing", "C++", "MQTT"]
                },
                {
                    title: "Traffic Flow Prediction Model",
                    description: "Created deep learning models for predicting traffic patterns up to 4 hours in advance with 92% accuracy.",
                    icon: "chart-line",
                    tags: ["TensorFlow", "LSTM", "Big Data", "Apache Spark"]
                },
                {
                    title: "Smart Parking System",
                    description: "Designed an IoT-based parking management system reducing search time by 60% through real-time availability tracking.",
                    icon: "parking",
                    tags: ["IoT", "Node.js", "MongoDB", "React"]
                },
                {
                    title: "Emergency Vehicle Prioritization",
                    description: "Implemented a system for automatic green-wave creation for emergency vehicles, reducing response times by 30%.",
                    icon: "ambulance",
                    tags: ["Real-time Systems", "GPS", "Python", "Redis"]
                },
                {
                    title: "Multimodal Transportation Optimizer",
                    description: "Developed an algorithm optimizing routes across multiple transportation modes, improving overall network efficiency by 25%.",
                    icon: "route",
                    tags: ["Graph Theory", "Optimization", "Java", "PostgreSQL"]
                }
            ],
            skills: {
                technical: [
                    { name: "Traffic Simulation (VISSIM, SUMO)", level: 5 },
                    { name: "Machine Learning & AI", level: 5 },
                    { name: "Data Analysis & Visualization", level: 5 },
                    { name: "Signal Optimization", level: 4 },
                    { name: "Connected Vehicle Systems", level: 4 },
                    { name: "GIS & Spatial Analysis", level: 4 }
                ],
                software: [
                    { name: "Python (TensorFlow, PyTorch)", level: 5 },
                    { name: "MATLAB/Simulink", level: 5 },
                    { name: "SQL & NoSQL Databases", level: 4 },
                    { name: "C++ & Java", level: 4 },
                    { name: "R Statistical Computing", level: 4 },
                    { name: "Cloud Platforms (AWS, Azure)", level: 3 }
                ],
                research: [
                    { name: "Research Design & Methodology", level: 5 },
                    { name: "Statistical Analysis", level: 5 },
                    { name: "Technical Writing", level: 5 },
                    { name: "Grant Writing", level: 4 },
                    { name: "Project Management", level: 4 },
                    { name: "Public Speaking", level: 4 }
                ]
            },
            contact: {
                email: "cody@traffic-systems.com",
                linkedin: "https://linkedin.com/in/cody-traffic-engineer",
                github: "https://github.com/cody-traffic"
            }
        };
    }

    // Additional method to load external resources if needed
    async loadResource(url, type = 'json') {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to load resource: ${url}`);
            }
            
            switch(type) {
                case 'json':
                    return await response.json();
                case 'text':
                    return await response.text();
                case 'blob':
                    return await response.blob();
                default:
                    return response;
            }
        } catch (error) {
            console.error(`Error loading resource ${url}:`, error);
            return null;
        }
    }

    // Method to preload multiple resources
    async preloadResources(urls) {
        const promises = urls.map(url => this.load(url));
        return Promise.all(promises);
    }

    // Clear cache if needed
    clearCache() {
        this.cache.clear();
    }

    // Get cached data without fetching
    getCached(url) {
        return this.cache.get(url) || null;
    }
}