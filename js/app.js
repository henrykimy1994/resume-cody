// Main Application Entry Point
import ThreeScene from './modules/ThreeScene.js';
import TrafficNetwork from './modules/TrafficNetwork.js';
import UIController from './modules/UIController.js';
import DataLoader from './modules/DataLoader.js';

class ResumeApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.threeScene = null;
        this.trafficNetwork = null;
        this.uiController = null;
    }

    async init() {
        try {
            // Load resume data
            const data = await this.dataLoader.load('/data/resume-data.json');
            
            // Initialize Three.js scene
            this.threeScene = new ThreeScene('bg-canvas');
            this.threeScene.init();
            
            // Initialize traffic network visualization
            this.trafficNetwork = new TrafficNetwork(this.threeScene.scene);
            this.trafficNetwork.create();
            
            // Initialize UI Controller
            this.uiController = new UIController(data);
            this.uiController.init();
            
            // Start animation
            this.animate();
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.threeScene) {
            this.threeScene.render();
        }
        
        if (this.trafficNetwork) {
            this.trafficNetwork.update();
        }
    }

    handleResize() {
        if (this.threeScene) {
            this.threeScene.handleResize();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ResumeApp();
    app.init();
});