
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d'); //2d drawing context so I can fake 3d using math
    let d = 400

    const dis = document.getElementById('display');



    let angleX = 0, angleY = 0, angleZ = 0 //keep track of rotation
    let cameraX = 0,  cameraY = 0,  cameraZ = 0


    window.addEventListener('keydown', e => {

    if (e.key === 'ArrowLeft') angleY += 0.1;
    if (e.key === 'ArrowRight') angleY -= 0.1;
    if (e.key === 'ArrowUp') angleX -= 0.1;
    if (e.key === 'ArrowDown') angleX += 0.1;

    if (e.key === 'q') cameraY += 1;
    if (e.key === 'e') cameraY -= 1;
    if (e.key === 'a') cameraX -= 1;
    if (e.key === 'd') cameraX += 1;
    if (e.key === 'w') cameraZ += 1;
    if (e.key === 's') cameraZ -= 1;
    display.innerText = `X pos: ${cameraX}, Y pos: ${cameraY}, Z pos: ${cameraZ} \n X angle: ${angleX} Y angle: ${angleY}`;

    });

    function update_mobile_display(){
        display.innerText = `X pos: ${cameraX}, Y pos: ${cameraY}, Z pos: ${cameraZ} \n X angle: ${angleX} Y angle: ${angleY}`;

    }

    // Cube vertices (3D points)
    const vertices = [

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
    const edges = [
        /*
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],

         */

    ];
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


    function worldToCamera([x,y,z]) {
        // translate world so camera is at origin
        let dx = x - cameraX;
        let dy = y - cameraY;
        let dz = z - cameraZ;

        // inverse rotate Y (camera yaw)
        let cosY = Math.cos(-angleY), sinY = Math.sin(-angleY);
        let xz = dx * cosY - dz * sinY;
        let zz = dx * sinY + dz * cosY;

        // inverse rotate X (camera pitch)
        let cosX = Math.cos(-angleX), sinX = Math.sin(-angleX);
        let yz = dy * cosX - zz * sinX;
        let zz2 = dy * sinX + zz * cosX;

        return [xz, yz, zz2];
    }

/*
    cube(-2, -2, -2, 4)
    pyramid(-1, -1, -1, 2)
    pyramid(1, 1, 1, -2)

 */

    //character


    function sphere(mx, my, mz, msize) {
        let visited = new Set()
        function wrapper(x, y, z, size){
            console.log(size)

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





    sphere(0, 0, -2, 3)
    sphere(0, -5, 0, 3)
    sphere(6, 0, 4, 3)





    // TEMP placeholder: simply draw vertices as points
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
