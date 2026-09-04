# TicTacToe V2

This is the second version of TicTacToe that I will make, the primary focus of this version would be a complete, deployable game which is also scalable, this will focus on following aspects (business requirements):

1. Bot Games
2. Local Multiplayer Game
3. Online Matchmaking Game
4. Online Friend Game
5. Leaderboard

## Path

It will be divided into groups of 4 stage each, first 4 focus on local game and next 4 on online game and matchmaking

1. First stage would be building UI for the game itself, that includes a main menu, a game screen with required components
2. Second Stage would be building the game logic as optimized as possible using bitmaps and precomputed winning stages rather than a for loop check on every move.
3. Third stage would be implementing a simple two player game.
4. Fourth stage would be bot implementation for single player game.

Next stages primary focus will be on matchmaking and online games, without the bugs that version 1 have.

0. Start with Auth logic as that is required for verifying users.
1. Start with building the backend and logic for simple random matchmaking. (This and next would have similar logic so think about these then make anything)
2. Second stage will be connecting with a friend using a Room.
3. Third stage would be building the UI for matchmaking for both friend matchmaking and random matchmaking.
4. Last will be implementation of leaderboard on backend and UI on frontend for leaderboard.
