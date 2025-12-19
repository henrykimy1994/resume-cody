export default class TrafficNetwork {
    constructor(scene) {
        this.scene = scene;
        this.nodes = [];
        this.connections = [];
        this.vehicles = [];
        this.nodeCount = 20;
        this.connectionCount = 30;
    }

    create() {
        this.createNodes();
        this.createConnections();
        this.createVehicles();
    }

    createNodes() {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.5
        });

        for (let i = 0; i < this.nodeCount; i++) {
            const node = new THREE.Mesh(geometry, material.clone());
            node.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            
            this.nodes.push(node);
            this.scene.add(node);
        }
    }

    createConnections() {
        for (let i = 0; i < this.connectionCount; i++) {
            const node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            const node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            
            if (node1 === node2) continue;

            const points = [];
            points.push(node1.position);
            points.push(node2.position);

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0x0088ff,
                opacity: 0.3,
                transparent: true
            });

            const line = new THREE.Line(geometry, material);
            this.connections.push({
                line: line,
                start: node1.position,
                end: node2.position
            });
            this.scene.add(line);
        }
    }

    createVehicles() {
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0088,
            emissive: 0xff0088,
            emissiveIntensity: 0.8
        });

        for (let i = 0; i < 10; i++) {
            const vehicle = new THREE.Mesh(geometry, material.clone());
            const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
            
            vehicle.userData = {
                connection: connection,
                progress: Math.random(),
                speed: 0.002 + Math.random() * 0.003
            };
            
            this.vehicles.push(vehicle);
            this.scene.add(vehicle);
        }
    }

    update() {
        // Animate nodes
        this.nodes.forEach((node, i) => {
            node.rotation.y += 0.01;
            node.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
        });

        // Animate vehicles along connections
        this.vehicles.forEach(vehicle => {
            const { connection, progress, speed } = vehicle.userData;
            
            vehicle.userData.progress += speed;
            
            if (vehicle.userData.progress > 1) {
                vehicle.userData.progress = 0;
                vehicle.userData.connection = this.connections[
                    Math.floor(Math.random() * this.connections.length)
                ];
            }
            
            const newPos = new THREE.Vector3().lerpVectors(
                vehicle.userData.connection.start,
                vehicle.userData.connection.end,
                vehicle.userData.progress
            );
            
            vehicle.position.copy(newPos);
            vehicle.rotation.x += 0.05;
            vehicle.rotation.z += 0.05;
        });
    }
}