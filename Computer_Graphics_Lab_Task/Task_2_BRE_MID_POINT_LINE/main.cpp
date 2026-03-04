#include<GL/glut.h>
#include<cmath>


void display(){


glClear(GL_COLOR_BUFFER_BIT);

float x1=100,  y1=100;
float x2=400, y2=300;


float dx=x2-x1;
float dy=y2-y1;

float dnew=2*dy-dx;

float x=x1;
float y=y1;

glPointSize(5);

glBegin(GL_POINTS);

while (x <= x2) {
        glVertex2i(x, y);

        if (dnew <= 0) {
            dnew = dnew + 2 * dy;
        } else {
            y++;
            dnew = dnew + 2 * (dy - dx);
        }
        x++;
    }

    glEnd();
    glFlush();
}



void setup() {
    glClearColor(0, 0, 0, 1);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(0, 500, 0, 500);
}

int main(int argc, char** argv)
{
    glutInit(&argc, argv);

    glutInitWindowSize(500,500);
    glutCreateWindow("BHMLA");
    glClearColor(0,0,0,1);
    glColor3f(0,0,1);

    setup();

    glutDisplayFunc(display);

    glutMainLoop();

    return 0;
}
