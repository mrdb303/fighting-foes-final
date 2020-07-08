
Coding challenge part 1, 2 and 3 for March, April and May 2020

Set by HowToCodeWell:  https://www.howtocodewell.net



'Build a fighting game'.


Uses HTML, CSS and JavaScript.


This is the final version and includes changes made after the code review.
Full functionality as specified in the challenge is shown in the 'brief.html' file.
This also includes a list of features added that were not in the original challenge brief.

---------


Game overview:

100 creatures are paired up and are fighting until only one creature remains.
There are four creature types: witches, dragons, snakes and river trolls.

Each creature is generated at random using the following stats:


Witches

    Strength between 60 - 80
    Health between 50 - 60

Dragons

    Strength between 80 - 90
    Health between 80 - 90

Snakes

    Strength between 30 - 60
    Health between 30 - 90

River Trolls

    Strength between 22 - 65
    Health between 60 - 92



Instructions

The game is controlled at random by rolling a pair of dice, by clicking on the 'Roll Dice button'.


Stage 1 - Roll Dice mode

Once the dice has been rolled, the table will update to show opponents and stats. Underneath the table will be the respective matchups.
If there are no doubles rolled, then the code will jump past the next stage direct to fight mode.


Stage 2 - Process Power

If there are doubles rolled, then the game will apply at random the powers issued. The table will also show the powers generated for the respective creature.
Where the matchups are shown underneath the table, the powers will also be displayed there too.

Pressing the 'Process Power' button will apply the powers to the creature table and amend the creature stats accordingly. Underneath the table you will see the actual power stats that have been applied. For example, a power could be 'Increases strength between 1 - 100'. In this circumstance the summary will show the actual strength value applied (i.e. 56 if that is the random value generated).

Also shown is the calculated value of the health points that will be lost if the fight completes. Note that there are cases which will mean that the opponent will not lose additional health points, such as:

- Creature skips a go through gaining the 'Hide/Skip a go' power.
- Creature has been eliminated due to the result of special powers being applied
- Creature being defeated before it gets an attack (i.e. if its health is at zero from the first strike of its opponent, when it is second in line to attack)


Stage 3 - Fight

The battle commences in the correct fighting order. The creature going first gets the first strike and health points are lost by the opponent. To calculate health points lost, add the creature's strength who is attacking to the sum of the dice. If the opponent is left with health points greater than zero, then the opponent will strike and cause the first fighter to lose health points. If a creature is reduced to zero health points, then it is eliminated.

When the stage is over, the page will update the main table and list the creatures that were eliminated in that round.

If one creature remains, then the battle is over and the trophy and medal are displayed. At this stage you can press the reset button to restart the game.
If more than one creature remains, then the game continues with the remaining creatures and goes back to stage one for the next fighting round. 


Additional Information:

A special power only lasts for one fighting round.

If there are an odd number of creatures, then a creature will be picked at random to not participate in the round of fighting. If this creature has been granted a special power, then it will not be processed.

The action buttons are still available for creature modification throughout the duration of the game(add health/remove health/delete creature). Once the winner is announced, then clicking the action buttons will have no effect. 
