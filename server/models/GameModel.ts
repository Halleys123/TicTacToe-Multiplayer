import mongoose, { Schema } from 'mongoose';

const GameSchema: Schema<IGame> = new Schema<IGame>({
  game_id: {
    type: String,
    required: true,
  },
  player_one_id: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  player_two_id: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  player_one_move: {
    type: String,
    required: false,
  },
  player_two_move: {
    type: String,
    required: false,
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: false,
  },
  final_board: {
    type: [[String]],
    required: false,
  },
});

const GameModel = mongoose.model<IGame>('Game', GameSchema);

export default GameModel;
