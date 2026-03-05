#include <GL/glut.h>
#include <math.h>

void setup()
{
    glClearColor(0,0,0,1);

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(-4.0,4.0,-4.0,4.0,-4.0,4.0);

    glMatrixMode(GL_MODELVIEW);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);

    // Square
    glBegin(GL_POLYGON);
    glColor3f(0,1,0);
    glVertex2f(0.5,0.5);
    glVertex2f(2.0,0.5);
    glVertex2f(2.0,2.0);
    glVertex2f(0.5,2.0);
    glEnd();

    // Top Triangle
    glBegin(GL_TRIANGLES);
    glColor3f(0,0,1);
    glVertex2f(0.5,2.0);
    glVertex2f(2.0,2.0);
    glVertex2f(1.25,3.0);
    glEnd();

    // Bottom Triangle
    glBegin(GL_TRIANGLES);
    glColor3f(0,0,1);
    glVertex2f(0.5,0.5);
    glVertex2f(2.0,0.5);
    glVertex2f(1.25,-0.5);
    glEnd();

    // Left Triangle
    glBegin(GL_TRIANGLES);
    glColor3f(0,0,1);
    glVertex2f(0.5,0.5);
    glVertex2f(0.5,2.0);
    glVertex2f(-0.5,1.25);
    glEnd();

    // Right Triangle
    glBegin(GL_TRIANGLES);
    glColor3f(0,0,1);
    glVertex2f(2.0,0.5);
    glVertex2f(2.0,2.0);
    glVertex2f(3.0,1.25);
    glEnd();

    glFlush();
}

int main(int argc, char** argv)
{
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);

    glutInitWindowSize(500,500);
    glutInitWindowPosition(100,100);

    glutCreateWindow("Alvi");

    setup();
    glutDisplayFunc(display);

    glutMainLoop();

    return 0;
}
