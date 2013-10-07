#Loop Lamp Interactive Interface

##Default

When a user first plugs in their lamp the default presets will be enabled. The lamp's dormant state will be white at 100% brightness. The lamp's active state, triggered by live tweets including "#lightupchicago", will be a five second color flourish animation (or something else, yet to be determined).

##What users can control "programmatically"

Users will be encouraged to play with the light colors and animations of their lamp. If twitter input is enabled, they will also be able to customize what custom text strings their lamp is monitoring twitter for.

- Dormant behavior of the lamp (static or animated)
- Dormant color of the lamp (static or animated)
- Active behavior of the lamp (static or animated)
- Active color of the lamp (static or animated)
- Active state (time)
- Custom animation (LED patterns)

A __static__ setting contains three `r`, `g`, and `b` values that are non changing.

An __animated__ setting contains `r`, `g`, and `b` values that can be programmatically controlled to changed over time.

Active state __time__ is the length of time in seconds (floats allowed i.e. .33 seconds) that the lamp will take to visualize the active state (i.e. a tweet).

Custom animation __LED Patterns__ allow the user to create highly customizable animated patterns by controlling each individual LED in their lamp. Users will be able to adjust any and all LED per animation "frame" much like creating a GIF animation. Users will have control over number of frames in the animation as well as the duration of those frames.

###LED Pattern Example:

<img src="custom_animation.png" alt="Example Image" style="width: 80%;"/>

##Presets

Presets are used to save custom dormant and active lamp states. They can allow users to easily save and load their lamp state and custom animation programs and experiment with different setups.

##Interface

Below is a prototype interface that allows users to program their lamps. The final version of this page will be included as a "Loop Lamp" packaged app at the user's coder.local/.

![Input page layout](input_demo.png)

##Backend
