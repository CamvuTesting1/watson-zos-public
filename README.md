<html>

<head>
<meta http-equiv="Content-Type"
content="text/html; charset=iso-8859-1">
<meta name="GENERATOR" content="Microsoft FrontPage Express 2.0">
<title></title>
</head>

<body>

<h1 align="center" style="border-bottom: none;"><font
face="Arial">GitHub Enterprise for DFSMS</font></h1>

<p class="MsoNormalCxSpFirst"
style="line-height:normal;background:#F4B083;
mso-background-themecolor:accent2;mso-background-themetint:153"><font
face="Arial"><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">Connecting to GitHub using SSH protocol in Git Bash
&#150; Linux command prompt<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="font-size:
17.0pt;mso-bidi-font-size:11.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:
minor-latin">Generating a new SSH key:<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;color:red">$ssh-keygen -t rsa -b 4096 -C
&quot;your_email@example.com&quot;<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">Enter a file in which to save the key
(/c/Users/you/.ssh/id_rsa):[Press enter]<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">Enter passphrase (empty for no passphrase): [Type a
passphrase]<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">Enter same passphrase again: [Type passphrase again]<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;mso-no-proof:yes"><!--[if gte vml 1]><v:shapetype
 id="_x0000_t75" coordsize="21600,21600" o:spt="75" o:preferrelative="t"
 path="m@4@5l@4@11@9@11@9@5xe" filled="f" stroked="f">
 <v:stroke joinstyle="miter"/>
 <v:formulas>
  <v:f eqn="if lineDrawn pixelLineWidth 0"/>
  <v:f eqn="sum @0 1 0"/>
  <v:f eqn="sum 0 0 @1"/>
  <v:f eqn="prod @2 1 2"/>
  <v:f eqn="prod @3 21600 pixelWidth"/>
  <v:f eqn="prod @3 21600 pixelHeight"/>
  <v:f eqn="sum @0 0 1"/>
  <v:f eqn="prod @6 1 2"/>
  <v:f eqn="prod @7 21600 pixelWidth"/>
  <v:f eqn="sum @8 21600 0"/>
  <v:f eqn="prod @7 21600 pixelHeight"/>
  <v:f eqn="sum @10 21600 0"/>
 </v:formulas>
 <v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/>
 <o:lock v:ext="edit" aspectratio="t"/>
</v:shapetype><v:shape id="Picture_x0020_5" o:spid="_x0000_i1031" type="#_x0000_t75"
 alt="A screenshot of a cell phone&#13;&#10;&#13;&#10;Description generated with very high confidence"
 style='width:321pt;height:179.25pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:readme_images/clip_image001.png"
  o:title="A screenshot of a cell phone&#13;&#10;&#13;&#10;Description generated with very high confidence"/>
</v:shape><![endif]--><img src="testHTML/clip_image002.gif"
alt="A screenshot of a cell phone

Description generated with very high confidence"
width="428" height="239" v:shapes="Picture_x0020_5"></span><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="font-size:
17.0pt;mso-bidi-font-size:11.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:
minor-latin">Adding your SSH key to the ssh-agent:<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">+ Start the ssh-agent to run in the background:<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;color:red">$ eval ssh-agent -s<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;mso-no-proof:yes"><!--[if gte vml 1]><v:shape
 id="Picture_x0020_2" o:spid="_x0000_i1030" type="#_x0000_t75" style='width:366.75pt;
 height:60.75pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:readme_images/clip_image003.png"
  o:title=""/>
</v:shape><![endif]--><img src="clip_image003.gif" width="489" height="81"
v:shapes="Picture_x0020_2"></span><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">SSH_AUTH_SOCK=/tmp/ssh-8c8vIvUzUIGl/agent.2528;
export SSH_AUTH_SOCK;<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">SSH_AGENT_PID=28804; export SSH_AGENT_PID;<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">echo Agent pid 28804;<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">+ Add your SSH private key to the ssh-agent: <o:p></o:p></span> </font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;color:red">$ ssh-add<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;mso-no-proof:yes"><!--[if gte vml 1]><v:shape
 id="Picture_x0020_1" o:spid="_x0000_i1029" type="#_x0000_t75" style='width:438.75pt;
 height:39pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:readme_images/clip_image004.png"
  o:title=""/>
</v:shape><![endif]--><img src="clip_image004.gif" width="585" height="52"
v:shapes="Picture_x0020_1"></span><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">(or <span style="color:red">$ ssh-add ~/.ssh/id_rsa</span>)<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin">+Copy the SSH key to your clipboard:<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;color:red">$ clip &lt; ~/.ssh/id_rsa.pub<br>
</span><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">(or open and copy the content of file <span style="color:red">id_rsa.pub </span>using a text
editor)<o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin;mso-no-proof:yes"><!--[if gte vml 1]><v:shape
 id="Picture_x0020_3" o:spid="_x0000_i1028" type="#_x0000_t75" style='width:198.75pt;
 height:25.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:readme_images/clip_image005.png"
  o:title=""/>
</v:shape><![endif]--><img src="clip_image005.gif" width="265" height="34"
v:shapes="Picture_x0020_3"></span><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p></o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="mso-bidi-font-family:
Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="font-size:
17.0pt;mso-bidi-font-size:11.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:
minor-latin">Add the SSH key to your GitHub account<o:p></o:p></span></font></p>

<p class="MsoNormal"
style="mso-margin-top-alt:auto;mso-margin-bottom-alt:auto;
line-height:normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">+ In the upper-right corner of any GitHub page,
click your profile photo, then click <b>Settings</b>. <o:p></o:p></span> </font></p>

<p class="MsoNormal"
style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><span style="mso-spacerun:yes">&nbsp;</span><span style="mso-no-proof:yes"><!--[if gte vml 1]><v:shape
 id="Picture_x0020_10" o:spid="_x0000_i1027" type="#_x0000_t75" alt="Authentication keys"
 style='width:115.5pt;height:45.75pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:readme_images/clip_image006.png"
  o:title="Authentication keys"/>
</v:shape><![endif]--><img src="clip_image007.gif"
alt="Authentication keys" width="154" height="61"
v:shapes="Picture_x0020_10"></span><span style="mso-spacerun:yes">&nbsp;</span>In the user settings sidebar,
click <b>SSH and GPG keys</b>. <o:p></o:p></span></font></p>

<p class="MsoNormal"
style="mso-margin-top-alt:auto;mso-margin-bottom-alt:auto;
line-height:normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">Click <b>New SSH key</b> or <b>Add SSH key</b>. <span style="mso-spacerun:yes">
&nbsp;&nbsp;</span><span style="mso-no-proof:yes"><!--[if gte vml 1]><v:shape id="Picture_x0020_9"
 o:spid="_x0000_i1026" type="#_x0000_t75" alt="SSH Key button" style='width:273pt;
 height:61.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:readme_images/clip_image008.png"
  o:title="SSH Key button"/>
</v:shape><![endif]--><img src="clip_image009.gif" alt="SSH Key button"
width="364" height="82" v:shapes="Picture_x0020_9"></span><o:p></o:p></span></font></p>

<p class="MsoNormal"
style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">In the &quot;Title&quot; field, add a descriptive
label for the new key. For example, if you're using a personal
Mac, you might call this key &quot;Personal MacBook Air&quot;. <o:p></o:p></span></font></p>

<p class="MsoNormal"
style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><span style="mso-spacerun:yes">&nbsp; </span><span style="mso-no-proof:yes"><!--[if gte vml 1]><v:shape
 id="Picture_x0020_8" o:spid="_x0000_i1025" type="#_x0000_t75" alt="The key field"
 style='width:300pt;height:209.25pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:readme_images/clip_image010.png"
  o:title="The key field"/>
</v:shape><![endif]--><img src="clip_image011.gif"
alt="The key field" width="400" height="279"
v:shapes="Picture_x0020_8"></span><o:p></o:p></span></font></p>

<p class="MsoNormal"
style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">Paste your key into the &quot;Key&quot; field. Click
<b>Add SSH key</b>. <o:p></o:p></span></font></p>

<p class="MsoNormal"
style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></font></p>

<p class="MsoNormalCxSpMiddle" style="line-height:normal"><font
face="Arial"><span style="font-size:
17.0pt;mso-bidi-font-size:11.0pt;mso-bidi-font-family:Calibri;mso-bidi-theme-font:
minor-latin">Working with GitHub through command lines<o:p></o:p></span></font></p>

<p class="MsoNormal"
style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
normal"><font
face="Arial"><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></font></p>
</body>
</html>
