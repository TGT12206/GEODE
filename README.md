# GEODE
A game maker (think about the level of scratch). GEODE stands for: Game Engine for Open Development by Everyone (or anything else. open to suggestions)
- Block based visual scripting (it's called amethyst)
- Project data is saved in markdown files, except for files put into the project folder by the user (such as images or videos)
- 4 tabs: File Manager, Scene View, Script Editor, Game View
Create a new project folder/Choose a project folder to open (you can have multiple in the same vault):
![1](https://github.com/user-attachments/assets/246e79cb-8e4a-4c8e-a66f-ca083fce774c)

The plugin uses its own file manager. This file manager only has access to folders within the project.
NOTICE: When uploading images, videos, or sound, make sure to upload using the plugin's file manager! Don't just place files into the project folder.
![2](https://github.com/user-attachments/assets/58c9fc6a-c2c2-4942-8d62-83bf984f0c7e)

In the scene view, you can create new game objects. Click the refresh button to see your changes take effect. The sprite path is relative to your project folder. Make sure to include the first /
![3](https://github.com/user-attachments/assets/a73d045e-9469-44db-abe9-b279af4f575c)

You can edit the scripts of each object by switching to the script editor "tab", or by clicking the edit scripts button on the object.
![4](https://github.com/user-attachments/assets/c9539665-ff01-4caa-a040-5d1c9e4125ef)
- The first dropdown at the top is for the object you are editing.
- The second object is for the cluster type. Each object has 2 cluster types (at least so far): On Start and On New Frame. These clusters are called on their respective events.
- You can have multiple of each cluster type on a single game object, and they will be executed asynchronously. This is the number next to the cluster type dropdown.

Make sure to save after writing code!
![5](https://github.com/user-attachments/assets/586468bf-12c8-4f1a-9b11-e57db139901e)

The Game View compiles all the code and runs it in real time
![6](https://github.com/user-attachments/assets/c1748f1a-31e8-4632-b969-4dec625030b2)
