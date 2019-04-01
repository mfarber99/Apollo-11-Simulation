class Particle
{
    constructor(position, texture)
    {
        this.position = position;
        this.texture = texture;
    }
}

class Rocket_Simulation extends Scene_Component {
     // The scene begins by requesting the camera, shapes, and materials it will need.
    constructor(context, control_box) {
        super(context, control_box);

        // First, include a secondary Scene that provides movement controls:
        if(!context.globals.has_controls)
            context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        // Locate the camera here (inverted matrix).
        const r = context.width / context.height;
        context.globals.graphics_state.camera_transform = Mat4.translation([0, -3, -45]);
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
        // design.  Once you've told the GPU what the design of a cube is,
        // it would be redundant to tell it again.  You should just re-use
        // the one called "box" more than once in display() to draw
        // multiple cubes.  Don't define more than one blueprint for the
        // same thing here.
        const shapes = {
            'square': new Square(),
            'circle': new Circle(50),
            'ball': new Subdivision_Sphere(.5),
            'box': new Cube(),
            'cylinder': new Cylinder(50),
            'cone': new Cone(50),
            'prism': new TriangularPrism(),
            'myShape': new myShape(75),  //Circular trapezoid 
            'myShapeTwo': new myShapeTwo(50) //No roof on the special shape
        }
        this.submit_shapes(context, shapes);
        this.shape_count = Object.keys(shapes).length;

        // Make some Material objects available to you:
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
            ambient: .4,
            diffusivity: .4
        });
        this.plastic = this.clay.override({
            specularity: .6
        });
        this.texture_base = context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        // Load some textures for the demo shapes
        this.shape_materials = {};
        const shape_textures = {
            metal: "assets/dirtyWhite.png",
            sky: "assets/gradient_sky3.jpg",
            grass: "assets/grass.jpg",
            launch: "assets/launch.jpg",
            crate: "assets/metal_crate.png",
            zero: "assets/zero.png",
            one: "assets/one.png",
            two: "assets/two.png",
            three: "assets/three.png",
            four: "assets/four.png",
            five: "assets/five.png",
            moonDistant: "assets/moon.png",
            rocketSide: "assets/rocketSide.png",
            metalStripes: "assets/metal_stripe.jpg",
            gold: "assets/gold.png",
            earth: "assets/earth.jpg",
            moon: "assets/moon2.jpeg",
            end: "assets/end.png",
            text: "assets/text.png",
            smoke: "assets/smoke.png",
            fire: "assets/fire.png"
        };
        for (let t in shape_textures)
            this.shape_materials[t] = this.texture_base.override({
                texture: context.get_instance(shape_textures[t])
            });
        
        this.lights = [new Light(Vec.of(10, 10, 20, 1), Color.of(1, 1, 1, 1), 100000)];

        this.t = 0;

        this.white = Color.of(1, 1, 1, 1);
        this.black = Color.of(0, 0, 0, 1);
        
        //Declare and get textures of each particle using a shader
        this.numParticles = 25;
        this.levels = 25;
        this.particles = new Array(this.levels)
        for(let i = 0; i < this.levels; i++)
        {
           this.particles[i] = new Array(this.numParticles);
        }
        
        this.particleColors = new Array(this.levels);
        for(let i = 0; i < this.levels; i++)
        {
           this.particleColors[i] = context.get_instance(Basic_Shader).material(Vec.of(1,1 - i/50,0.5 - i/50,1 - i/50));
        }
    }
    


    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    make_control_panel() {
        this.key_triggered_button("Start Launch Sequence", ["l"], () => {
            this.start = true;
        });
        
        this.key_triggered_button("Time Speed Up", ["t"], () => {
            this.timeBool = true;
        });

        this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
    }

//Display all particles needed based on time
displayParticles(graphics_state, translateX, translateY, translateZ, addedSpeedUpTop, subSpeedUpTop, roverSlowdown, roverRotate, rotate, t)
{
    //First rocket fire particles up until first break of rocket
    if(t > 8 && t < 41)
    {   
        //Incrementally increase and decrease the levels "length" of rocket boost particles
        if(t < 8.05)
        {
            var levels = 1;
        }
        else if(t < 8.1)
        {
            var levels = 2;
        }
        else if(t < 8.15)
        {
            var levels = 3;
        }
        else if(t < 8.2)
        {
            var levels = 4;
        }
        else if(t < 8.25)
        {
            var levels = 5;
        }
        else if(t < 8.30)
        {
            var levels = 6;
        }
        else if(t < 8.35)
        {
            var levels = 7;
        }
        else if(t < 8.40)
        {
            var levels = 8;
        }
        else if(t < 8.45)
        {
            var levels = 9;
        }
        else if(t < 8.5)
        {
            var levels = 10;
        }
        else if(t < 8.55)
        {
            var levels = 11;
        }
        else if(t < 8.6)
        {
            var levels = 12;
        }
        else if(t < 8.65)
        {
            var levels = 13;
        }
        else if(t < 8.7)
        {
            var levels = 14;
        }
        else if(t < 8.75)
        {
            var levels = 15;
        }
        else if(t < 8.8)
        {
            var levels = 16;
        }
        else if(t < 8.85)
        {
            var levels = 17;
        }
        else if(t < 8.9)
        {
            var levels = 18;
        }
        else if(t < 8.95)
        {
            var levels = 19;
        }
        else if(t < 9)
        {
            var levels = 20;
        }
        else if(t < 9.05)
        {
            var levels = 21;
        }
        else if(t < 9.10)
        {
            var levels = 22;
        }
        else if(t < 9.15)
        {
            var levels = 23;
        }
        else if(t < 9.2)
        {
            var levels = 24;
        }
        else if(t < 39.75)
        {
            var levels = 25;
        }
        else if(t < 39.80)
        {
            var levels = 24;
        }
        else if(t < 39.85)
        {
            var levels = 23;
        }
        else if(t < 39.90)
        {
            var levels = 22;
        }
        else if(t < 39.95)
        {
            var levels = 21;
        }
        else if(t < 40)
        {
            var levels = 20;
        }
        else if(t < 40.05)
        {
            var levels = 19;
        }
        else if(t < 40.10)
        {
            var levels = 18;
        }
        else if(t < 40.15)
        {
            var levels = 17;
        }
        else if(t < 40.20)
        {
            var levels = 16;
        }
        else if(t < 40.25)
        {
            var levels = 15;
        }
        else if(t < 40.30)
        {
            var levels = 14;
        }
        else if(t < 40.35)
        {
            var levels = 13;
        }
        else if(t < 40.40)
        {
            var levels = 12;
        }
        else if(t < 40.45)
        {
            var levels = 11;
        }
        else if(t < 40.50)
        {
            var levels = 10;
        }
        else if(t < 40.55)
        {
            var levels = 9;
        }
        else if(t < 40.60)
        {
            var levels = 8;
        }
        else if(t < 40.65)
        {
            var levels = 7;
        }
        else if(t < 40.70)
        {
            var levels = 6;
        }
        else if(t < 40.75)
        {
            var levels = 5;
        }
        else if(t < 40.80)
        {
            var levels = 4;
        }
        else if(t < 40.85)
        {
            var levels = 3;
        }
        else if(t < 40.90)
        {
            var levels = 2;
        }
        else
        {
            var levels = 1;
        }
        var numParticles = 25;
        
        //Create random placement of particles on each level
        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        //Create Particles in every slot needed in particle array
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (2.25 + i*.15);
                var yOff = (9.5 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX, translateY, translateZ)))
                                                                 .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * 0.5 - yOff, rand[i][j][2] * xzOff - xzOff/2)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        //Draw these needed particles
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    }
    //Second Rocket Boost
    if(t > 43.7 && t < 48.7)
    {
        if(t < 43.75)
        {
            var levels = 1;
        }
        else if(t < 43.8)
        {
            var levels = 2;
        }
        else if(t < 43.85)
        {
            var levels = 3;
        }
        else if(t < 43.9)
        {
            var levels = 4;
        }
        else if(t < 43.95)
        {
            var levels = 5;
        }
        else if(t < 44)
        {
            var levels = 6;
        }
        else if(t < 48.40)
        {
            var levels = 7;
        }
        else if(t < 48.45)
        {
            var levels = 6;
        }
        else if(t < 48.50)
        {
            var levels = 5;
        }
        else if(t < 48.55)
        {
            var levels = 4;
        }
        else if(t < 48.60)
        {
            var levels = 3;
        }
        else if(t < 48.65)
        {
            var levels = 2;
        }
        else
        {
            var levels = 1;
        }
        var numParticles = 25;

        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (1.25 + i*.10);
                var yOff = (9.5 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX + 16, translateY, translateZ)))
                                                                 .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * 0.5 - yOff, rand[i][j][2] * xzOff - xzOff/2)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    }

    //Third Rocket Boost
    if(t > 49.9 && t < 54)
    {
        if(t < 49.95)
        {
            var levels = 1;
        }
        else if(t < 50)
        {
            var levels = 2;
        }
        else if(t < 50.05)
        {
            var levels = 3;
        }
        else if(t < 53.85)
        {
            var levels = 4;
        }
        else if(t < 53.90)
        {
            var levels = 3;
        }
        else if(t < 53.95)
        {
            var levels = 2;
        }
        else
        {
            var levels = 1;
        }
        var numParticles = 25;

        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (.75 + i*.10);
                var yOff = (9.5 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX + 19 + addedSpeedUpTop, translateY, translateZ)))
                                                                 .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * 0.5 - yOff, rand[i][j][2] * xzOff - xzOff/2)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    }

    //Third Rocket boost coming back to get the moon lander
    if(t > 57.4 && t < 59.3)
    {
        if(t < 57.4)
        {
            var levels = 1;
        }
        else if(t < 57.45)
        {
            var levels = 2;
        }
        else if(t < 59.20)
        {
            var levels = 3;
        }
        else if(t < 59.25)
        {
            var levels = 2;
        }
        else
        {
            var levels = 1;
        }
        var numParticles = 25;

        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (.5 + i*.05);
                var yOff = (9.5 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX + 5 + addedSpeedUpTop + subSpeedUpTop, translateY, translateZ)))
                                                                 .times(Mat4.rotation(Math.PI, Vec.of(1,0,0)))
                                                                 .times(Mat4.rotation(rotate, Vec.of(0, 0, 1)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * 0.5 - yOff, rand[i][j][2] * xzOff - xzOff/2)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    }

    //Moon lander rocket boost
    if(t > 59.7 && t < 62.8)
    {
        if(t < 59.75)
        {
            var levels = 1;
        }
        else if(t < 62.75)
        {
            var levels = 2;
        }
        else
        {
            var levels = 1;
        }
        var numParticles = 25;

        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (.5 + i*.10);
                var yOff = (9.5 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX + 9.25 + addedSpeedUpTop, translateY, translateZ)))
                                                                 .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * 0.5 - yOff, rand[i][j][2] * xzOff - xzOff/2)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    }

    //Boost for detatchment of nose cone from moon lander
    if(t > 64.5 && t < 64.65)
    {
        var levels = 1;
        var numParticles = 25;

        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (.25 + i*.10);
                var yOff = (9.5 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX + 11.25 + addedSpeedUpTop - roverSlowdown, translateY, translateZ)))
                                                                 .times(Mat4.rotation(Math.PI, Vec.of(1,0,0)))
                                                                 .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * 0.5 - yOff, rand[i][j][2] * xzOff - xzOff/2)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    }
    
    //Moon Lander Boost to get out of orbit
    if(t > 72.2  && t < 75.1)
    {
        var levels = 1;
        var numParticles = 25;

        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (.3 + i*.10);
                var yOff = (9.25 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX + 9 - roverSlowdown, translateY, -translateZ + roverRotate+2.5)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * xzOff - xzOff/2, rand[i][j][2] * 0.5 - yOff)))
                                                                 .times(Mat4.rotation(Math.PI, Vec.of(0, 0, 1)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    }
    
    //Moon Lander Rocket boost to slow down and land on moon
    if(t > 76.75 && t < 87.85)
    {
        if(t < 76.8)
        {
            var levels = 1;
        }
        else if(t < 76.85)
        {
            var levels = 2;
        }
        else if(t < 76.9)
        {
            var levels = 3;
        }
        else if(t < 86.35)
        {
            var levels = 4;
        }
        else if(t < 86.85)
        {
            var levels = 3;
        }
        else if(t < 87.35)
        {
            var levels = 2;
        }
        else 
        {
            var levels = 1;
        }


        var numParticles = 25;

        var rand = new Array(levels);
        for(let i = 0; i < levels; i++)
        {
           rand[i] = new Array(numParticles);
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                rand[i][j] = new Array(3);
            }
        }

        for(let i = 0; i < levels; i++)
        {
            for(let j = 0; j < numParticles; j++)
            {
                    for(let k = 0; k < 3; k++)
                    {
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                            rand[i][j][k] = Math.random();
                    }
            }
        }

        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            if(!this.paused)
            {
                var xzOff = (.5 + i*.10);
                var yOff = (9.25 + i*.5);
                this.particles[i][j] = new Particle(Mat4.identity().times(Mat4.translation(Vec.of(translateX + 8.85 - roverSlowdown, translateY + .07, -translateZ + roverRotate-.5)))
                                                                 .times(Mat4.translation(Vec.of(rand[i][j][0] * xzOff - xzOff/2, rand[i][j][1] * xzOff - xzOff/2, rand[i][j][2] * 0.5 - yOff)))
                                                                 .times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)))
                                                                 .times(Mat4.scale(0.5)), 
                                                                 this.particleColors[i]);
            }

          }
        }
    
        
        for(let i = 0; i < levels; i++)
        {
          for(let j = 0; j < numParticles; j++)
          {
            this.shapes.ball.draw(
                graphics_state,
                this.particles[i][j].position,
                this.particles[i][j].texture
                );
          }
        }
    } 
 }
     //Build rocket and moon lander at all times
     build_rocket(graphics_state, t) {
        let m = Mat4.identity();
        
        //declare some times of events, we eventually just used specific times, but started by defining these variables
        var translateSub = 8;
        var rotateSub = 18;
        var straightSub = 38;
        var breakSub = 42;

        //Declare and initialize variables for X and Y motion using logistic equations
        var translateY = 0;
        if(t > translateSub)
        {
            translateY = (1200 / (1 + Math.exp(-1/2 * ((t - translateSub) - 20)))) - .045;
        }

        var translateX = 0;
        
        if(t > translateSub)
        {
            translateX = (1000 / (1 + Math.exp(-1/2 * ((t - translateSub) - 27))));
        }
       
        //Adjust speed of rocket when it breaks
        var firstBreak = 0;
        
        if(t > breakSub + 2)
        {
            firstBreak = 15 * (t - (breakSub + 2));
        }

        var secondBreak = 0;
        if(t > 60.75)
        {
            secondBreak = 2 * (t - 60.75) * (t -60.25);
        }

        //Rotate rocket as it leaves atmosphere
        var rotate = 0;
        if(t > rotateSub)
        {
            rotate = Math.atan((500*Math.exp(-1/2 * ((t - rotateSub) - 27)))/Math.pow((1 + Math.exp(-1/2 * ((t - rotateSub) - 27))), 2));
        }
        
        //Change speeds as time goes on
        if(t > straightSub)
        {
            rotate = Math.PI/2;
            translateX = 960 + 10*(t - straightSub);
        }

        if(t > 60)
        {
            translateX = 960 + 20*(t + 22 - 60);
        }

        if(t > 67.5)
        {
            translateX = 1460 + 20*(t + 22 - 60);
        }

        //slowdown for the moon lander
        var roverSlowdown;
        if(t > 64.5)
        {
            roverSlowdown = 15*(t - 64.5) + (10 / (1 + Math.exp(-1/1.15 * ((t - 64.5) - 12))));
        }
        else 
        {
            roverSlowdown = 0;
        }

        //logistic equation for the descent of the moon lander
        var translateZ = 0;
        
        if(t >= 68)
        {
            translateZ = (750 / (1 + Math.exp(-1/1.15 * ((t - 68) - 12))));
        }

        if(t >= 80)
        {
            translateX = 2300;
            roverSlowdown = 242.045;
        }

        if(t > 88)
        {
            translateZ = 749.315;
        }

        //Camera cuts for the whole project
        if(!this.paused)
        {
        if(t < rotateSub - 2)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 20, 50), Vec.of(0, 0, 0), Vec.of(0,1,0));
        }
        else if(t < rotateSub + 2.85)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 20, 12), Vec.of(0, 20, 0), Vec.of(0,1,0));
        }
        else if(t > rotateSub && t < straightSub)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX, 4+translateY + 2, 55), Vec.of(translateX, translateY, 1), Vec.of(0,1,0));
        }
        else if(t > straightSub && t < 42)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX - 40, 4+translateY+15, -5), Vec.of(translateX + 20, translateY, -5), Vec.of(0,1,0));
        }
        else if(t < 48)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX, 4+translateY + 2, 55), Vec.of(translateX, translateY, 1), Vec.of(0,1,0));
        }
        else if(t < 56.5)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX+15, 4+translateY + 2, 25), Vec.of(translateX+15, translateY, 1), Vec.of(0,1,0));
        }
        else if(t < 61.5)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX+27, translateY, 8), Vec.of(translateX, translateY, -5), Vec.of(0,1,0));
        }
        else if(t < 67.5)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX+7.5-roverSlowdown, translateY, 25), Vec.of(translateX+7.5-roverSlowdown, translateY, 0), Vec.of(0,1,0));
        }
        else if(t < 71.75)
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX+50-roverSlowdown, translateY, 3-translateZ), Vec.of(translateX-roverSlowdown, translateY, -translateZ), Vec.of(0,0,1));        
        }
        else if(t < 92)
        {
           if(t < 90.5)
           {
               graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX+50 -1.8*(t - 71.75) - roverSlowdown, translateY, 3 - translateZ), Vec.of(translateX-roverSlowdown, translateY, -translateZ), Vec.of(0,0,1));
           }
           else
           {
               graphics_state.camera_transform = Mat4.look_at(Vec.of(translateX+50 -1.8*(90.5 - 71.75) - roverSlowdown, translateY, 3 - translateZ), Vec.of(translateX-roverSlowdown, translateY, -translateZ), Vec.of(0,0,1));
           }
        }
        else
        {
            graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 0, -25), Vec.of(0, 0, 0), Vec.of(0,1,0));
        }
        }

        //Sounds for entire project
        if(t > 2.25 && t < 2.28)
        {
            var countdown = new Audio('assets/countdown.mp3');
            countdown.play();
        }

        if(t > 3 && t < 3.03)
        {
            var firstRocket = new Audio('assets/firstRocket.mp3');
            firstRocket.play();
        }

        if((t > 43.7 && t < 43.73) || (t > 49.9 && t < 49.93))
        {
            var hatch = new Audio('assets/hatch.mp3');
            hatch.play();

            var mid = new Audio('assets/midRocket.mp3');
            mid.play();
        }

        if(t > 57.1 && t < 57.13)
        {
            var next = new Audio('assets/nextRocket.mp3');
            next.play();
        }
        

        if(t > 59.1 && t < 59.13)
        {
             var click = new Audio('assets/click.mp3');
             click.play();
        }
    
        if( (t > 59.7 && t < 59.74) || (t > 72 && t < 72.04))
        {
                var tinyRocket = new Audio('assets/tinyRocket.mp3');
                tinyRocket.play();
        }

        if(t > 64.5 && t < 64.53)
        {
                var bop = new Audio('assets/bop.mp3');
                bop.play();
        }


        if(t > 76.75 && t < 76.78)
        {
                var smallRocket = new Audio('assets/smallRocket.mp3');
                smallRocket.play();
        }


        if(t > 87 && t < 87.03)
        {
             var eagle = new Audio('assets/eagle.mp3');
             eagle.play();
        }

        //Variables needed for different rocket speeds
        var addedSpeedUpTop;
        if(t >= 50 && t < 54)
        {
            addedSpeedUpTop = 2*(t - 50);
        }
        else if(t < 50)
        {
            addedSpeedUpTop = 0;
        }
        else
        {
            addedSpeedUpTop = 8;
        }

        var subSpeedUpTop;
        if(t >= 56.5 && t < 59.2)
        {
            subSpeedUpTop = -2*(t - 56.5);
        }
        else if(t < 56.5)
        {
            subSpeedUpTop = 0;
        }
        else
        {
            subSpeedUpTop = -5.4;
        }
        
        //Variables needed for rotating the nose cone
        var rotateTop;
        var rotatePos;
        if(t > 54.25)
        {
            rotatePos = 12.5;
            if(1/3*(t-54.25)*Math.PI <= Math.PI)
            {
                rotateTop = 1/3*(t-54.25)*Math.PI;
            }
            else
            {
                rotateTop = Math.PI;
            }
        }
        else
        {
            rotatePos = 0;
            rotateTop = 0;
        }

        var rotateY;
        var roverRotate;
        if(t > 67)
        {
            roverRotate = 8.75;
            if(1/4*(t-67)*Math.PI/2 <= Math.PI/2)
            {
                rotateY = 1/4*(t-67)*Math.PI/2;
            }
            else
            {
                rotateY = Math.PI/2;
            }
        }
        else
        {
            rotateY = 0;
            roverRotate = 0;
        }

        
        
        //Display all particles and include the arguments needed to follow each rocket part
        this.displayParticles(graphics_state, translateX, translateY, translateZ, addedSpeedUpTop, subSpeedUpTop, roverSlowdown, roverRotate, rotate, t);
        
//Nose cone
        if(t < 70)
        {
        this.shapes.cone.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + addedSpeedUpTop + rotatePos + subSpeedUpTop, translateY, 0)))
        .times(Mat4.rotation(rotate - rotateTop, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 16 - rotatePos, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(.89, .89, 2))),
        this.shape_materials['metal']
        );

        this.shapes.myShape.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + addedSpeedUpTop + rotatePos + subSpeedUpTop, translateY, 0)))
        .times(Mat4.rotation(rotate - rotateTop, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 14.5 - rotatePos, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of((1 + 1/3), (1 + 1/3), 1.5))),
        this.shape_materials['launch']
        );

        this.shapes.cylinder.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + addedSpeedUpTop + rotatePos + subSpeedUpTop, translateY, 0)))
        .times(Mat4.rotation(rotate - rotateTop, Vec.of(0, 0, -1)))
        .times(Mat4.rotation(Math.PI/3, Vec.of(0, 1, 0)))
        .times(Mat4.translation(Vec.of(0, 12.5 - rotatePos, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of((1 + 1/3), (1 + 1/3), 2))),
        this.shape_materials['rocketSide']
        );

        this.shapes.circle.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + addedSpeedUpTop + rotatePos + subSpeedUpTop, translateY, 0)))
        .times(Mat4.rotation(rotate - rotateTop, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 16 - rotatePos, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(.89, .89, 4))),
        this.shape_materials['metal']
        );

        this.shapes.circle.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + addedSpeedUpTop + rotatePos + subSpeedUpTop, translateY, 0)))
        .times(Mat4.rotation(rotate - rotateTop, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 10.5 - rotatePos, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(1 + 1/3, 1 + 1/3, 4))),
        this.shape_materials['metal']
        );

        this.shapes.cone.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + addedSpeedUpTop + rotatePos + subSpeedUpTop, translateY, 0)))
        .times(Mat4.rotation(rotate - rotateTop, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 10 - rotatePos, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(1, 1, 2))),
        this.shape_materials['metalStripes']
        );

        this.shapes.circle.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + addedSpeedUpTop + rotatePos + subSpeedUpTop, translateY, 0)))
        .times(Mat4.rotation(rotate - rotateTop, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 14.5 - rotatePos, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of((1 + 1/3), (1 + 1/3), 4))),
        this.shape_materials['metal']
        );
        }
//Middle of rocket that holds the moon lander
        if(t < 65)
        {
            this.shapes.cone.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX - secondBreak, translateY, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.translation(Vec.of(0, 7.25, 0)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
            .times(Mat4.scale(Vec.of(1.5, 1.5, 2))),
            this.shape_materials['metalStripes']
            );

            this.shapes.myShapeTwo.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX - secondBreak, translateY, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.translation(Vec.of(0, 8, 0)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
            .times(Mat4.scale(Vec.of(2, 2, 2.5))),
            this.shape_materials['metal']
            );
        }

        //body, shaft
       if(t < 50)
       {
        this.shapes.cylinder.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX - firstBreak, translateY, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.rotation(Math.PI/3, Vec.of(0, 1, 0)))
        .times(Mat4.translation(Vec.of(0, 0, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(2, 2, 8))),
        this.shape_materials['rocketSide']
        );

        this.shapes.circle.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX - firstBreak, translateY, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, -8, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(2, 2, 4))),
        this.shape_materials['metal']
        );

        this.shapes.circle.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX - firstBreak, translateY, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 8, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(2, 2, 4))),
        this.shape_materials['metal']
        );
    
        this.shapes.cone.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX - firstBreak, translateY, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, -9, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(2, 2, 5))),
        this.shape_materials['metalStripes']
        );

        //stabilizers
        for(let i = 0; i < 4; i++)
        {
            this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX - firstBreak, translateY, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.rotation(Math.PI/2 * i, Vec.of(0, 1, 0)))
            .times(Mat4.translation(Vec.of(0, -5.75, 2.45)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(0, 1, 0)))
            .times(Mat4.scale(Vec.of(0.5, 2, 0.1))),
            this.shape_materials['metal']
            );

            this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX - firstBreak, translateY, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.rotation(Math.PI/2 * i, Vec.of(0, 1, 0)))
            .times(Mat4.translation(Vec.of(0, -7.75, 3.45)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(0, 1, 0)))
            .times(Mat4.scale(Vec.of(0.5, 2, 0.1))),
            this.shape_materials['metal']
            );

            this.shapes.prism.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX - firstBreak, translateY, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.rotation(Math.PI/2 * i, Vec.of(0, 1, 0)))
            .times(Mat4.translation(Vec.of(0, -5.75, 2.95)))
            .times(Mat4.rotation(-Math.PI/2, Vec.of(0, 1, 0)))
            .times(Mat4.scale(Vec.of(1, 2, 0.1))),
            this.plastic.override({color: this.black})
            );
        }
       }
       
        //moon lander
        this.shapes.myShape.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + roverRotate - roverSlowdown, translateY, -translateZ)))
        .times(Mat4.rotation(rotateY, Vec.of(0, -1, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 8.75 - roverRotate, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(1, 1, 1.25))),
        this.shape_materials['gold']
        );

        for(let i = 0; i < 4; i++)
        {
            this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX + roverRotate - roverSlowdown, translateY, -translateZ)))
            .times(Mat4.rotation(rotateY, Vec.of(0, -1, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.rotation(Math.PI/2 * i, Vec.of(0, 1, 0)))
            .times(Mat4.translation(Vec.of(0, 8.694 - roverRotate, 1.265)))
            //.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0)))
            .times(Mat4.scale(Vec.of(0.1, 0.625, 0.05))),
            this.shape_materials['gold']
            );

            this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX + roverRotate - roverSlowdown, translateY, -translateZ)))
            .times(Mat4.rotation(rotateY, Vec.of(0, -1, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.rotation(Math.PI/2 * i, Vec.of(0, 1, 0)))
            .times(Mat4.translation(Vec.of(0, 9.0345 - roverRotate, 1.1075)))
            .times(Mat4.rotation(Math.PI/16, Vec.of(1, 0, 0)))
            .times(Mat4.scale(Vec.of(0.1, 0.3, 0.05))),
            this.shape_materials['gold']
            );

            this.shapes.circle.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(translateX + roverRotate - roverSlowdown, translateY, -translateZ)))
            .times(Mat4.rotation(rotateY, Vec.of(0, -1, 0)))
            .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
            .times(Mat4.rotation(Math.PI/2 * i, Vec.of(0, 1, 0)))
            .times(Mat4.translation(Vec.of(0, 8.0675 - roverRotate, 1.275)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0)))
            .times(Mat4.scale(Vec.of(0.2, 0.2, 1))),
            this.shape_materials['gold']
            );
        }

        this.shapes.cone.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + roverRotate - roverSlowdown, translateY, -translateZ)))
        .times(Mat4.rotation(rotateY, Vec.of(0, -1, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 8.625 - roverRotate, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0)))
        .times(Mat4.scale(Vec.of(.4, .4, 1))),
        this.shape_materials['metalStripes']
        );

        this.shapes.cone.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + roverRotate - roverSlowdown, translateY, -translateZ)))
        .times(Mat4.rotation(rotateY, Vec.of(0, -1, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 10.25 - roverRotate, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0)))
        .times(Mat4.scale(Vec.of(.3, .3, 1.5))),
        this.shape_materials['launch']
        );

        this.shapes.circle.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(translateX + roverRotate - roverSlowdown, translateY, -translateZ)))
        .times(Mat4.rotation(rotateY, Vec.of(0, -1, 0)))
        .times(Mat4.rotation(rotate, Vec.of(0, 0, -1)))
        .times(Mat4.translation(Vec.of(0, 10.001 - roverRotate, 0)))
        .times(Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0)))
        .times(Mat4.scale(Vec.of(.25, .25, 1))),
        this.shape_materials['metal']
        );

        if(t > 67.5)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(1100, 900, - translateZ)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(0, 1, 0)))
            .times(Mat4.scale(Vec.of(500, 500, 1))),
            this.shape_materials['earth']
            );   
        }
    }

    //builds the arm and holder of the rocket
    build_arm(graphics_state, deg, t)
    {
      if(t < 42)
      {

              var armRotateOne;
              if(t > 8 && t < 9)
              {
                      armRotateOne = Math.PI/2*(t-8);
              }
              else if(t > 9)
              {
                      armRotateOne = Math.PI/2;
              }
              else
              {
                      armRotateOne = 0;
              }

        let m = Mat4.identity();
        {
             m = m.times(Mat4.translation(Vec.of(-6, -9.25, 0)));
            this.shapes.box.draw(
                graphics_state,
                m.times(Mat4.scale(Vec.of(0.5, 0.5, 0.5))),
                this.shape_materials['crate']);
            for (var i = 0; i < 22; ++i) {
                 m = m.times(Mat4.translation(Vec.of(-0.5, 0.5, 0)))
                    .times(Mat4.rotation(0.05 * deg, Vec.of(0, 0, 1)))
                    .times(Mat4.translation(Vec.of(0.5, 0.5, 0)));
                this.shapes.box.draw(
                    graphics_state,
                    m.times(Mat4.scale(Vec.of(0.5, 0.5, 0.5))),
                    this.shape_materials['crate']);

                    if(i == 11)
                    {
                       for(var j = 0; j < 2; j++)
                       {
                          var mult = 1;
                          if(j == 0)
                          {
                              mult = -1;
                          }
                          
                           let n = m.times(Mat4.translation(Vec.of(.5, 0, mult*.5))).times(Mat4.rotation(armRotateOne, Vec.of(0, mult*-1, 0)));

                           n = n.times(Mat4.translation(Vec.of(.5, 0, mult*2)));
                           this.shapes.box.draw(
                                graphics_state,
                                n.times(Mat4.scale(Vec.of(0.5, 0.5, 2))),
                                this.shape_materials['crate']
                                );
                           
                           n = n.times(Mat4.translation(Vec.of(2.5, 0, mult*2.5))).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
                           this.shapes.box.draw(
                                graphics_state,
                                n.times(Mat4.scale(Vec.of(0.5, 0.5, 2))),
                                this.shape_materials['crate']
                                );

                           n = n.times(Mat4.translation(Vec.of(mult*1.75, 0, mult*mult*2.5))).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
                           this.shapes.box.draw(
                                graphics_state,
                                n.times(Mat4.scale(Vec.of(0.5, 0.5, 1.25))),
                                this.shape_materials['crate']
                                );
                         
                       }
                    }
            }
            this.shapes.box.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(2.0825, 1, 0))).times(Mat4.scale(Vec.of(2.5825, 0.5, 0.5))),
                this.shape_materials['crate']);
        }
      }
      
    }
    
    //builds the backgrounds of the scene including earth and moon
    build_background(graphics_state, t) {
        let m = Mat4.identity();
        
        if (t < 42)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(350, 571, -200)))
            .times(Mat4.scale(Vec.of(700, 750, 1))),
            this.shape_materials['sky']
            );

            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0, -9.75, 0)))
             .times(Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0)))
             .times(Mat4.scale(Vec.of(200, 200, 1))),
            this.shape_materials['grass']
            );

            this.shapes.circle.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0, -9.7, 0)))
            .times(Mat4.scale(Vec.of(15, 1, 15)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(-1, 0, 0))),
            this.shape_materials['launch']
            );
        }
        else 
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(350, 571, -200)))
            .times(Mat4.scale(Vec.of(700, 750, 1))),
            this.plastic.override({color: this.black})
            );
        }

        
        if(t < 45)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(1800, 1100, -250)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0)))
            .times(Mat4.rotation(Math.PI/2, Vec.of(0, 1, 0)))
            .times(Mat4.scale(Vec.of(100, 100, 1))),
            this.shape_materials['moonDistant']
            );    
        }

        this.shapes.square.draw(
        graphics_state,
        m.times(Mat4.translation(Vec.of(1800, 1100, -1750)))
        .times(Mat4.scale(Vec.of(256, 256, 1))),
        this.shape_materials['earth']
        );
        if(t > 60)
        {
            this.shapes.circle.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(2400, 1100, -750)))
            .times(Mat4.scale(Vec.of(1024, 1024, 1))),
            this.shape_materials['moon']
            );   
        }
        if(t > 88)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0, 0, -5)))
            .times(Mat4.rotation(Math.PI, Vec.of(0, 1, 0)))
            .times(Mat4.rotation(2*Math.PI, Vec.of(1, 0, 0)))
             .times(Mat4.scale(Vec.of(10, 10, 1))),
            this.plastic.override({color: this.black})
            );

        }
    }

    //builds the countdown of the rocket
    build_scoreboard(graphics_state, t)
    {
        var x = 30, y = 0, z = -10;
        let m = Mat4.identity();
        if(t < 4)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(x, y, z)))
            .times(Mat4.rotation(Math.atan(2/5), Vec.of(-1,0,0)))
            .times(Mat4.scale(Vec.of(6, 6, 1))),
            this.shape_materials['five']
            );
        }
        else if(t < 5)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(x, y, z)))
            .times(Mat4.rotation(Math.atan(2/5), Vec.of(-1,0,0)))
            .times(Mat4.scale(Vec.of(6, 6, 1))),
            this.shape_materials['four']
            );
        }
        else if(t < 6)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(x, y, z)))
            .times(Mat4.rotation(Math.atan(2/5), Vec.of(-1,0,0)))
            .times(Mat4.scale(Vec.of(6, 6, 1))),
            this.shape_materials['three']
            );
        }
        else if(t < 7)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(x, y, z)))
            .times(Mat4.rotation(Math.atan(2/5), Vec.of(-1,0,0)))
            .times(Mat4.scale(Vec.of(6, 6, 1))),
            this.shape_materials['two']
            );
        }
        else if(t < 8)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(x, y, z)))
            .times(Mat4.rotation(Math.atan(2/5), Vec.of(-1,0,0)))
            .times(Mat4.scale(Vec.of(6, 6, 1))),
            this.shape_materials['one']
            );
        } 
        else if(t < 16)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(x, y, z)))
            .times(Mat4.rotation(Math.atan(2/5), Vec.of(-1,0,0)))
            .times(Mat4.scale(Vec.of(6, 6, 1))),
            this.shape_materials['zero']
            );
        }
        if(t < 16)
        {
            this.shapes.square.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(x-58, y, z)))
            .times(Mat4.rotation(Math.atan(2/5), Vec.of(-1,0,0)))
            .times(Mat4.scale(Vec.of(20, 20, 1))),
            this.shape_materials['text']
            );
        }
        
    }

    //main function that builds the world
    display(graphics_state) {
        // Use the lights stored in this.lights.
        graphics_state.lights = this.lights;
               
        // Find how much time has passed in seconds, and use that to place shapes.  
        if (this.start && !this.paused && this.timeBool)
        {
            this.t += (graphics_state.animation_delta_time / 1000)*100;
        }
        
        if(this.start && !this.paused && !this.timeBool)
        {
            this.t += (graphics_state.animation_delta_time / 1000);
        }
        const t = this.t;

        this.timeBool = false;

        this.build_background(graphics_state, t);

        
        const deg = Math.abs(Math.cos(this.t))/3;
        if(t < Math.PI * 2.5)
        {
            this.build_arm(graphics_state, 0, t);
        }
        else if(t < Math.PI*3)
        {
            this.build_arm(graphics_state, deg, t);
        }
        else
        {
            this.build_arm(graphics_state, 1/3, t);
        }
        
        this.build_scoreboard(graphics_state, t);
        this.build_rocket(graphics_state, t);
        
    }
}

window.Rocket_Simulation = window.classes.Rocket_Simulation = Rocket_Simulation;
