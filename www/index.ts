import init, { Direction, WorldCell, World, WorldState } from "snake_game";

const CELL_SIZE = 50;
const WORLD_SIZE = 8;
init().then(wasm => {
  const canvas = <HTMLCanvasElement> document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');

  const world = World.new(WORLD_SIZE, new WorldCell(
    Math.floor(Math.random() * WORLD_SIZE),
    Math.floor(Math.random() * WORLD_SIZE),
  ), 3);
  const worldSize = world.size();

  document.addEventListener('keydown', (e) => {
    const currentDir = world.snake_direction();
    const blockedDir = currentDir === Direction.UP || currentDir === Direction.DOWN ? 'Vertical' : 'Horizontal';
    switch (e.key) {
      case 'ArrowUp':
        blockedDir !== 'Vertical' && world.snake_set_direction(Direction.UP);
        break;
      case 'ArrowDown':
        blockedDir !== 'Vertical' && world.snake_set_direction(Direction.DOWN);
        break;
      case 'ArrowLeft':
        blockedDir !== 'Horizontal' && world.snake_set_direction(Direction.LEFT);
        break;
      case 'ArrowRight':
        blockedDir !== 'Horizontal' && world.snake_set_direction(Direction.RIGHT);
        break;
      default:
        break;
    }
  })

  canvas.height = worldSize * CELL_SIZE;
  canvas.width = worldSize * CELL_SIZE;


  function drawWorld() {
    ctx.beginPath();

    for (let x = 0; x < worldSize + 1; x++) {
      ctx.moveTo(CELL_SIZE*x, 0);
      ctx.lineTo(CELL_SIZE*x, worldSize*CELL_SIZE);
    }

    for (let y = 0; y < worldSize + 1; y++) {
      ctx.moveTo(0, CELL_SIZE*y);
      ctx.lineTo(worldSize*CELL_SIZE, CELL_SIZE*y);
    }
    ctx.stroke();
  }

  function drawSnake() {
    // const { x, y } = world.snake_head_idx();
    const body = world.snake_body() as WorldCell[];
    for (const cell of body){
      const { x, y } = cell;
      ctx.beginPath();
      ctx.fillStyle = 'yellow';
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.stroke();
    }
  }

  function drawReward() {
    const { x, y } = world.reward_cell();
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.stroke();
  }

  function paint() {
    drawWorld();
    drawReward();
    drawSnake();
  }

  let anim: number | null = null;
  function update() {
    setTimeout(() => {
      console.log(world.state());
      if (anim && world.state() === WorldState.LOSS) {
        cancelAnimationFrame(anim);
        console.log('YOU LOST');
        return;
      } else if (anim && world.state() === WorldState.WON) {
        cancelAnimationFrame(anim);
        console.log('YOU WON');
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paint();
      world.snake_step();
      anim = requestAnimationFrame(update);
    }, 300)
  }

  paint();
  update();
});

