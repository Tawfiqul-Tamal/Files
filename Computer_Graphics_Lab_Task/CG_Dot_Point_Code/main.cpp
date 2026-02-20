#include <GL/glut.h>

void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    glPointSize(10.0);

    glBegin(GL_POINTS);
        glColor3f(1,0,1);
        glVertex2f(0.0, 0.0);


        glColor3f(1,0,1);
        glVertex2f(0.9, 0.0);


        glColor3f(1,0,1);
        glVertex2f(-0.9, 0.0);



        glColor3f(1,0,1);
        glVertex2f(0.0, 0.9);


        glColor3f(1,0,1);
        glVertex2f(0.0, -0.9);



        glColor3f(1,0,1);
        glVertex2f(0.9, 0.9);




        glColor3f(1,0,1);
        glVertex2f(-0.9, 0.9);



        glColor3f(1,0,1);
        glVertex2f(0.9, -0.9);


        glColor3f(1,0,1);
        glVertex2f(-0.9, -0.9);



        glColor3f(0,1,1);
        glVertex2f(0.45, 0.0);

        glColor3f(0,1,1);
        glVertex2f(-0.45, 0.0);


        glColor3f(0,1,1);
        glVertex2f(0.45, 0.9);

        glColor3f(0,1,1);
        glVertex2f(-0.45, 0.9);

        glColor3f(0,1,1);
        glVertex2f(0.45, -0.9);

        glColor3f(0,1,1);
        glVertex2f(-0.45, -0.9);

        glColor3f(1,1,1);
        glVertex2f(0.9, 0.45);

        glColor3f(1,1,1);
        glVertex2f(0.45, 0.45);

        glColor3f(1,1,1);
        glVertex2f(0.0, 0.45);

        glColor3f(1,1,1);
        glVertex2f(-0.45, 0.45);

        glColor3f(1,1,1);
        glVertex2f(-0.9, 0.45);

        glColor3f(1,1,1);
        glVertex2f(-0.9, -0.45);

        glColor3f(1,1,1);
        glVertex2f(-0.45, -0.45);

        glColor3f(1,1,1);
        glVertex2f(-0.0, -0.45);

        glColor3f(1,1,1);
        glVertex2f(0.45, -0.45);

        glColor3f(1,1,1);
        glVertex2f(0.9, -0.45);



        glEnd();


    glFlush();
}



int main(int argc, char** argv) {

    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);

    glutInitWindowSize(500,500);
    glutInitWindowPosition(100,100);

    glutCreateWindow("Tamal");
    //setup();
    glutDisplayFunc(display);

    glutMainLoop();

    return 0;
}
