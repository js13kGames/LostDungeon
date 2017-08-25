///<reference path="../State.ts"/>
class HomeState extends State<HTMLElement> {

    constructor(private gameService: GameService) {
        super('h');
    }

    init(stateListener: StateListener): void {
        super.init(stateListener);

        let universe = this.gameService.getUniverse();

        // add listeners
        let newGameElement = document.getElementById('n');
        newGameElement.onclick = () => {
            let game = this.gameService.createGame();
            let playerEntity: Entity = {
                orientation: ORIENTATION_NORTH,
                side: 1,
                id: game.nextEntityId++,
                behaviorType: BEHAVIOR_TYPE_PLAYER
            };
            let data: PlayStateData = {
                game: game,
                playerTransition: {
                    entity: playerEntity,
                    location: {
                        levelId: '_' + game.nextLevelId,
                        tileName: 's'
                    }
                }
            };
            stateListener(STATE_TYPE_PLAY, data);
        };
        newGameElement.setAttribute('href', '#_' + universe.nextGameId);

        // TODO might need to reduce down to a single game

        // add in existing games
        var existingGamesElement = document.getElementById('e');
        existingGamesElement.innerHTML = '';
        let games = this.gameService.getGames(universe.gameIds);
        for (let game of games) {
            let a = document.createElement('a');
            a.innerText = 'Game ' + game.gameId;
            a.setAttribute('href', '#' + game.gameId);
            a.onclick = ((game: Game) => {
                return () => {
                    let data: PlayStateData = {
                        game: game
                    };
                    stateListener(STATE_TYPE_PLAY, data);
                }
            })(game);
            existingGamesElement.appendChild(a);
        }
    }

}