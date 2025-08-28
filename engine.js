
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d'); //2d drawing context so I can fake 3d using math
    let d = 400

    const dis = document.getElementById('display'); //to show coordinates and rotation

    let angleX = 0, angleY = 0, angleZ = 0 //keep track of rotation
    let cameraX = 0,  cameraY = 0,  cameraZ = 0


    window.addEventListener('keydown', e => {

    if (e.key === 'ArrowLeft') angleY = (angleY + 0.1) % (2 * Math.PI); //loop back around after 360 degrees
    if (e.key === 'ArrowRight') angleY = (angleY - 0.1) % (2 * Math.PI);
    if (e.key === 'ArrowUp') angleX = (angleX - 0.1) % (2 * Math.PI);
    if (e.key === 'ArrowDown') angleX = (angleX + 0.1) % (2 * Math.PI);

    if (e.code === 'Space') place_item();

    if (e.key === 'q') cameraY += 1;
    if (e.key === 'e') cameraY -= 1;
    if (e.key === 'a') cameraX -= 1;
    if (e.key === 'd') cameraX += 1;
    if (e.key === 'w') cameraZ += 1;
    if (e.key === 's') cameraZ -= 1;

    if (e.key === 'c') circle();
    dis.innerText = `X pos: ${cameraX}, Y pos: ${cameraY}, Z pos: ${cameraZ} \n X angle: ${angleX} Y angle: ${angleY}`;

    });

    let distance = 3 //how far away blocks will be placed
    function place_item() {
        //this is basically just triangles
        let a = Math.sin(angleX) * distance
        let f = Math.sin(angleY) * distance

        let c = Math.cos(Math.max(Math.abs(angleX), Math.abs(angleY))) * distance //not sure that this is correct, its just what I came up with on the spot. should work since c is the same for both triangles.

        cube(cameraX+f, cameraY + a, cameraZ - c, 1)
    }

    /*
    function update_mobile_display(){
        dis.innerText = `X pos: ${cameraX}, Y pos: ${cameraY}, Z pos: ${cameraZ} \n X angle: ${angleX} Y angle: ${angleY}`;
    }
     */

    // Cube vertices (3D points)
    let vertices = [

        /*
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],

         */


    ];
    // Cube edges (pairs of vertex indices), [first point, second point]
    let edges = [
        /*
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],

         */

    ];

    function worldToCamera([x,y,z]) {
        // translate world so camera is at origin (just get position of v relative to camera)
        let dx = x - cameraX;
        let dy = y - cameraY;
        let dz = z - cameraZ;

        // **inverse** rotate Y (camera yaw) because we're imagining that the camera is rotating

        //NOTE: we're rotating the inverse of theta, it is important to keep in mind that cos(-x) = cos(x) but sin(-x) = -sin(x) so one must be careful when translating the rotation matrix
        let cosY = Math.cos(-angleY), sinY = Math.sin(-angleY);
        let xz = dx * cosY - dz * sinY;
        let zz = dx * sinY + dz * cosY;

        // inverse rotate X (camera pitch)
        let cosX = Math.cos(-angleX), sinX = Math.sin(-angleX);
        let yz = dy * cosX - zz * sinX;
        let zz2 = dy * sinX + zz * cosX;

        return [xz, yz, zz2];
    }

    //cool shapes
    function cube(start_x, start_y, start_z, size) {
        let c = [

            [start_x, start_y, start_z], //0, 0, 0
            [start_x + size, start_y, start_z], //1, 0, 0
            [start_x, start_y, start_z + size], //0, 0, 1
            [start_x + size, start_y, start_z + size], //1, 0, 1

            [start_x, start_y + size, start_z], //0, 1, 0
            [start_x + size, start_y + size, start_z], //1, 1, 0
            [start_x, start_y + size, start_z + size], //0, 1, 1
            [start_x + size, start_y + size, start_z + size], //1, 1, 1
        ]
        for (i of c){
            vertices.push(i)
        }


        let total_vertices = vertices.length;

        let e = [
            [total_vertices - 8, total_vertices - 7], //0, 0, 0 - 1, 0, 0
            [total_vertices - 8, total_vertices - 6], //0, 0, 0 - 0, 0, 1
            [total_vertices - 7, total_vertices - 5], //1, 0, 0 - 1, 0, 1
            [total_vertices - 6, total_vertices - 5], //0, 0, 1 - 1, 0, 1

            [total_vertices - 8, total_vertices - 4], //0, 0, 0 - 0, 1, 0
            [total_vertices - 7, total_vertices - 3], //1, 0, 0 - 1, 1, 0
            [total_vertices - 6, total_vertices - 2], //0, 0, 1 - 0, 1, 1
            [total_vertices - 5, total_vertices - 1], //1, 0, 1 - 1, 1, 1

            [total_vertices - 4, total_vertices - 3], //0, 1, 0 - 1, 1, 0
            [total_vertices - 4, total_vertices - 2], //0, 1, 0 - 0, 1, 1
            [total_vertices - 3, total_vertices - 1], //1, 1, 0 - 1, 1, 1
            [total_vertices - 2, total_vertices - 1], //0, 1, 1 - 1, 1, 1




        ]
        for (i of e){
            edges.push(i)
        }





    }
    function pyramid(start_x, start_y, start_z, size) {

        let c = [

            [start_x, start_y, start_z], //0, 0, 0
            [start_x + size, start_y, start_z], //1, 0, 0
            [start_x, start_y, start_z + size], //0, 0, 1
            [start_x + size, start_y, start_z + size], //1, 0, 1

            [start_x + size/2, start_y + size, start_z + size/2], //0.5, 1, 0.5
        ]
        for (i of c){
            vertices.push(i)
        }

        let total_vertices = vertices.length;

        let e = [
            [total_vertices - 5, total_vertices - 4], //0, 0, 0 - 1, 0, 0
            [total_vertices - 5, total_vertices - 3], //0, 0, 0 - 0, 0, 1
            [total_vertices - 4, total_vertices - 2], //1, 0, 0 - 1, 0, 1
            [total_vertices - 3, total_vertices - 2], //0, 0, 1 - 1, 0, 1

            [total_vertices - 5, total_vertices - 1],
            [total_vertices - 4, total_vertices - 1],
            [total_vertices - 3, total_vertices - 1],
            [total_vertices - 2, total_vertices - 1]




        ]
        for (i of e){
            edges.push(i)
        }


    }
    function sphere(mx, my, mz, msize) {
        let visited = new Set()
        function wrapper(x, y, z, size){
            //console.log(size)

            if (size > 1) {
                wrapper(x+1, y, z, size-1);
                wrapper(x-1, y, z, size-1);

                wrapper(x, y+1, z, size-1);
                wrapper(x, y-1, z, size-1);

                wrapper(x, y, z+1, size-1);
                wrapper(x, y, z-1, size-1);

            }

            // Create a unique key for this position
            const positionKey = `${x},${y},${z}`;

            // Check if we've already visited this position
            if (visited.has(positionKey)) {
                return;
            } else {
                visited.add(positionKey);
                cube(x, y, z, size-1);
            }




        }

        wrapper(mx, my, mz, msize);


    }
    function wall(start_x, start_y, start_z, direction, length) {

        let x = {value: start_x}, y = {value: start_y}, z = {value: start_z} //so I can fake pointers

        let change_variable //chooses which variable will change

        let d = 1 //positive or negative

        switch(direction) {
            case 'x+':
                change_variable = x;
                d = 1
                break;
            case 'x-':
                change_variable = x;
                d = -1
                break;
            case 'y+': //not sure why anyone would use this
                change_variable = y;
                d = 1
                break;
            case 'y-':
                change_variable = y;
                d = -1
                break;
            case 'z+':
                change_variable = z;
                d = 1
                break;
            case 'z-':
                change_variable = z;
                d = -1
                break;
            default:
                console.log('Enter a valid direction');
                break;
        }

        let goal = Math.abs(change_variable.value)+length;

        while(Math.abs(change_variable.value) < goal) {
            cube(x.value, y.value, z.value, 1);
            pyramid(x.value, y.value+1, z.value, 1);
            change_variable.value += d
        }


    }
    function circle() {
        let step = 0.1; // how much to rotate each step
        for (let a = 0; a < 2*Math.PI; a += step) {
            angleX = a;
            place_item();
        }
    }

    function save() {
        const content = JSON.stringify({vertices: vertices, edges: edges});
        const blob = new Blob([content], { type: 'json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'b3d_save.json'; a.click();
    }

    const file_upload = document.getElementById('upload');

    file_upload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fr = new FileReader();

        fr.onload = (e) => { //this runs after the file is actually read, which is why I need fr.readAsText at the bottotm
            try {
                const content = e.target.result;
                const data = JSON.parse(content);

                vertices = data.vertices;
                edges = data.edges;
                //console.log(data.vertices);
            } catch (error) {
                console.log("Error parsing JSON:", error);
            }
        };

        fr.readAsText(file);
    });

    // TEMP placeholder: simply draw vertices as points (maybe fill in later)
    function draw(vertices) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas
    //d is defined above
    const Zoffset = 5

    for (const [i, j] of edges) { //connect each i to j

        const ix = ((vertices[i][0]*d)/ (vertices[i][2] +Zoffset)); //try with and without offset
        const iy = ((vertices[i][1]*d)/ (vertices[i][2] +Zoffset));

        const jx = ((vertices[j][0]*d)/ (vertices[j][2] +Zoffset));
        const jy = ((vertices[j][1]*d)/ (vertices[j][2] +Zoffset));

        const x1 = canvas.width/2 + ix //0, 0 on the canvas is in the top left corner, not the centre of the screen

        const y1 = canvas.height/2 - iy //on the canvas y increases downward, so you must subtract
        const x2 = canvas.width/2 + jx
        const y2 = canvas.height/2 - jy

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'white';
        ctx.stroke();

}
}


    //these functions rotate the entire world instead of the camera
    /*

    function rotateX([x, y, z], angle) {
    let newY = y * Math.cos(angle) - z * Math.sin(angle);
    let newZ = y * Math.sin(angle) + z * Math.cos(angle);
    return [x, newY, newZ];
}


    function rotateY([x, y, z], angle) {
    let newX = (x*Math.cos(angle))+(z*Math.sin(angle));
    let newZ = (-x*Math.sin(angle))+(z*Math.cos(angle));
    return [newX, y, newZ];
}



    function rotateZ([x, y, z], angle) {
    let newX = (x*Math.cos(angle))-(y*Math.sin(angle));
    let newY = (x*Math.sin(angle))+(y*Math.cos(angle));

    return [newX, newY, z];
}

     */


    // Animation loop
    function loop() {
        /*
    let rotated_vertices = [];
    for (v of vertices) {
    let a = rotateX(v, angleX);
    a = rotateY(a, angleY);
    a = rotateZ(a, angleZ);

    rotated_vertices.push(a);
}

    draw(rotated_vertices);

         */

        let transformed = [];
        for (v of vertices) {
            transformed.push(worldToCamera(v));
        }
        draw(transformed);

        requestAnimationFrame(loop);
}

    loop();
