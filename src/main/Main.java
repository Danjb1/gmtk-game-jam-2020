package main;

import game.Launcher;

public class Main {

    public static void main(String[] args) {
        try {
            Launcher launcher = new Launcher();
            launcher.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
