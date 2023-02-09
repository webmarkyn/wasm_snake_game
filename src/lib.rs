use rand::Rng;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum Direction {
    UP,
    DOWN,
    RIGHT,
    LEFT,
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct WorldCell {
    pub x: i32,
    pub y: i32,
}

#[wasm_bindgen()]
impl WorldCell {
    #[wasm_bindgen(constructor)]
    pub fn new(x: i32, y: i32) -> WorldCell {
        WorldCell {
            x,
            y,
        }
    }
}

#[derive(Debug)]
#[wasm_bindgen]
pub struct Snake {
    size: i32,
    body: Vec<WorldCell>,
    direction: Direction,
    next_direction: Option<Direction>,
}

impl Snake {
    pub fn new(spawn_coords: WorldCell, size: i32) -> Snake {
        let mut body = vec![];
        for i in 1..size {
            body.push(WorldCell { x: spawn_coords.x, y: spawn_coords.y - i })
        }
        body.insert(0, spawn_coords);
        Snake {
            size,
            body,
            direction: Direction::DOWN,
            next_direction: None,
        }
    }

    pub fn update_body(&mut self, x: Option<i32>, y: Option<i32>) {
        if let Some(val) = x {
            self.body[0].x = val
        }

        if let Some(val) = y {
            self.body[0].y = val;
        }
    }

    pub fn set_direction(&mut self, direction: Direction) {
        self.direction = direction;
    }

}

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub enum WorldState {
    RUNNING,
    LOSS,
    WON,
}

#[derive(Debug)]
#[wasm_bindgen]
pub struct World {
    state: WorldState,
    size: i32,
    snake: Snake,
    reward: WorldCell, 
}

#[wasm_bindgen]
impl World {
    pub fn new(world_size: i32, snake_spawn_coords: WorldCell, snake_size: i32) -> World {
        World { 
            size: world_size,
            snake: Snake::new(snake_spawn_coords, snake_size),
            state: WorldState::RUNNING,
            reward: World::gen_reward_cell(world_size)
        }
    }

    pub fn gen_reward_cell(world_size: i32) -> WorldCell {
        let mut rng = rand::thread_rng();
        let x: i32 = rng.gen_range(0..world_size);
        let y: i32 = rng.gen_range(0..world_size);
        WorldCell {
            x,
            y
        }
    }

    pub fn reward_cell(&self) -> WorldCell {
        self.reward
    }

    pub fn size(&self) -> i32 {
        self.size
    }

    pub fn snake_direction(&self) -> Direction {
        self.snake.direction
    }

    pub fn snake_set_direction(&mut self, direction: Direction) {
        self.snake.next_direction = Some(direction);
    }

    pub fn snake_body(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.snake.body).unwrap()
        // self.snake.body.as_ptr()
    }

    pub fn snake_cell_len() -> usize {
        std::mem::size_of::<WorldCell>()
    }

    pub fn snake_body_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn state(&self) -> WorldState {
        self.state
    }

    pub fn set_reward(&mut self) {
        let mut reward_cell: Option<WorldCell> = None;
        'outer: while let None = reward_cell {
            let temp_cell = World::gen_reward_cell(self.size);
            for cell in &self.snake.body {
                if cell.x == temp_cell.x && cell.y == temp_cell.y {
                    continue 'outer;
                }
            }
            reward_cell = Some(temp_cell);
        }
        let reward_cell = reward_cell.expect("Failed to generate reward cell");
        self.reward = reward_cell;
    }

    pub fn snake_step(&mut self) {

        let last_cell = self.snake.body.pop().unwrap();

        if self.snake.body[0].x == self.reward.x && self.snake.body[0].y == self.reward.y {
            self.snake.size += 1;
            self.snake.body.push(WorldCell { x: last_cell.x , y: last_cell.y });
            if self.snake.size-1 == self.size*self.size {
                self.state = WorldState::WON;
            } else {
                self.set_reward();
            }
        }

        let body = &mut self.snake.body;

        let new_head = WorldCell {
            x: body[0].x,
            y: body[0].y,
        };

        body.insert(0, new_head);

        if let Some(val) = self.snake.next_direction {
            self.snake.direction = val;
            self.snake.next_direction = None;
        }

        match self.snake.direction {
            Direction::DOWN => body[0].y += 1,
            Direction::UP => body[0].y -= 1,
            Direction::RIGHT => body[0].x += 1,
            Direction::LEFT => body[0].x -= 1,
        }

        if body[0].x >= self.size { body[0].x = 0; }
        else if body[0].x < 0 { body[0].x = self.size - 1 }
        if body[0].y >= self.size { body[0].y = 0; }
        else if body[0].y < 0 { body[0].y = self.size - 1 }


        for i in 1..body.len() {
            if body[0].x == body[i].x && body[0].y == body[i].y {
               self.state = WorldState::LOSS;
            }
        }
    }
}

#[wasm_bindgen]
extern "C" {
#[wasm_bindgen(js_namespace=console)]
fn log(s: &str);
}
