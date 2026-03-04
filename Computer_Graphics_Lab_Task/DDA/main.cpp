#include <GL/glut.h>
#include <cmath>

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);

    float x1 = 100, y1 = 100;
    float x2 = 400, y2 = 300;

    float dx = x2 - x1;
    float dy = y2 - y1;

    float m = dy / dx;

    float x = x1;
    float y = y1;

    glPointSize(5);

    glBegin(GL_POINTS);

    if (fabs(m) < 1)
    {
        while (x <= x2 && y <= y2)
        {
            glVertex2i(x, y);

            x = x + 1;
            y = y + m;
        }
    }
    else
    {
        while (y <= y2)
        {
            glVertex2i(x, y);

            y = y + 1;
            x = x + (1/m);
        }
    }

    glEnd();

    glFlush();
}







int main(int argc, char** argv)
{
    glutInit(&argc, argv);

    glutInitWindowSize(500,500);
    glutCreateWindow("DDA slope cases");

       glClearColor(0,0,0,1);
    glColor3f(1,1,1);

    gluOrtho2D(0,500,0,500);

    glutDisplayFunc(display);

    glutMainLoop();

    return 0;
}
