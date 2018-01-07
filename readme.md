tl;dr: You are standing on a planet and are encircled by three stars dancing in a "Three-body problem".
The star system is not unlike Alpha Centauri. And the whole setting is not unlike the book ["The Three-Body Problem" by Liu Cixin](https://www.amazon.com/Three-Body-Problem-Cixin-Liu/dp/0765382032).

# installation

Download the repository. Upload everything to your webserver, and move it somewhere you can access it through a browser. Like ```/var/www/``` or wherever.

run ```index.html``` and enjoy.


# demo

[Demo available by clicking this blue text](http://labs.sense-studios.com/threebody/index.html)
Really. Just click it.

- - - -

__Before you read this:__

NOTE: This won't make a lot of Sense unless you've read the Three-Body Experiment by Liu Cixin.
The following contains _SPOILERS_

&nbsp;
### Here is the part without spoiling to much.

You're looking at a star-system containing three stars in close proximity. Not unlike
https://en.wikipedia.org/wiki/Alpha_Centauri Alpha Centauri, our closest galactic neighbor.

You are watching three stars circling each other. Now in Mathematics there is a curiosity
that is called the ( https://en.wikipedia.org/wiki/Three-body_problem ) *Three-body problem*

The paths of two objects circling each other are predictable, but a system of THREE objects circling
each other can *not* be predicted.

> In physics and classical mechanics, the three-body problem is the problem of taking an initial set of data that specifies the positions, masses, and velocities of three bodies for some particular point in time and then determining the motions of the three bodies, in accordance with Newton's laws of motion and of universal gravitation which are the laws of classical mechanics. The three-body problem is a special case of the n-body problem.

This simulation shows the influence of three suns on a planet that has the seed of life on it.
It calculates the amount of energy the planet receives, and life on the planet will either prosper and evolve, stall or be destroyed.

The simulation is reset when you refresh your browser, and the initial position of the planet and stars are randomized with every
reset (for now).

On the left are coordinates for all the celestial objects. On the right there is a score-card, if you will, that tells the
progress of the current 'civilizations'. Note that life on this planet slowly evolves.

&nbsp;
### Here is the part that spoils everything

In the book there is a civilization, or rather a series of civilizations that live on a planet.
The planet is orbiting in a three-star system. The days, nights even the years and eons are irregular.

Sometimes the distance between the stars and the planet is just right so liquid water can form. This is called a _stable era_
At other times the stars are too close, and the planet burns.
Or the stars are too far away, resembling three shooting stars, leaving a cold and barren planet. This is called a _cheotic era_

During a Stable era, life has a chance to evolve. When a stable era is replaced by a Chaotic era, evolution stops,
but when the suns return _civilization_ can continue. When the suns are too close however, and the planet burns, all hope
is lost and life and civilization have to start anew.

Life always finds a way, and some evolutionary traits will manage to survive even a burning planet.
The end goal is to reach some kind of "future technology 10". Which would enable you to get up and attack Earth
Although you can't really do anything to speed up the process. It's an interesting screen saver at best.

&nbsp;
##### roadmap

* add classifications in which era you are, and how high you are on the evolutionary ladder
* I'd still like to add a way to set the initial state of the simulation, that way you can re-run a simulation that had any interesting  results. Also I'd like to have a way to easily export the current position of all the objects.
